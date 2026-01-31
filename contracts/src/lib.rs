use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Balance, PanicOnDefault, Promise};

/// Escrow status for purchases
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, PartialEq)]
#[serde(crate = "near_sdk::serde")]
pub enum EscrowStatus {
    Pending,      // Funds held in escrow
    Released,     // Funds released to seller
    Refunded,     // Funds returned to buyer
    Disputed,     // Under dispute resolution
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct MarketplaceContract {
    owner: AccountId,
    datasets: UnorderedMap<u64, Dataset>,
    purchases: LookupMap<String, Purchase>,
    escrows: LookupMap<String, Escrow>,
    next_dataset_id: u64,
    marketplace_fee_percent: u8,
    escrow_period_ns: u64, // Escrow lock period in nanoseconds
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Dataset {
    pub id: u64,
    pub owner: AccountId,
    pub title: String,
    pub description: String,
    pub category: String,
    pub filecoin_cid: String,
    pub bio_validated: bool,
    pub zk_proof_hash: String,
    pub price: Balance,
    pub license: String,
    pub created_at: u64,
    pub downloads: u32,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Purchase {
    pub dataset_id: u64,
    pub buyer: AccountId,
    pub price_paid: Balance,
    pub timestamp: u64,
    pub escrow_released: bool,
}

/// Escrow record for secure payments
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Escrow {
    pub escrow_id: String,
    pub dataset_id: u64,
    pub buyer: AccountId,
    pub seller: AccountId,
    pub amount: Balance,
    pub fee: Balance,
    pub status: EscrowStatus,
    pub created_at: u64,
    pub release_at: u64,       // When funds can be auto-released
    pub dispute_reason: Option<String>,
}

#[near_bindgen]
impl MarketplaceContract {
    #[init]
    pub fn new(owner: AccountId) -> Self {
        Self {
            owner,
            datasets: UnorderedMap::new(b"d"),
            purchases: LookupMap::new(b"p"),
            escrows: LookupMap::new(b"e"),
            next_dataset_id: 0,
            marketplace_fee_percent: 2,
            escrow_period_ns: 7 * 24 * 60 * 60 * 1_000_000_000, // 7 days in nanoseconds
        }
    }

    // ==================== DATASET MANAGEMENT ====================

    #[payable]
    pub fn list_dataset(
        &mut self,
        title: String,
        description: String,
        category: String,
        filecoin_cid: String,
        bio_validated: bool,
        zk_proof_hash: String,
        price: Balance,
        license: String,
    ) -> u64 {
        let dataset = Dataset {
            id: self.next_dataset_id,
            owner: env::predecessor_account_id(),
            title,
            description,
            category,
            filecoin_cid,
            bio_validated,
            zk_proof_hash,
            price,
            license,
            created_at: env::block_timestamp(),
            downloads: 0,
        };

        self.datasets.insert(&self.next_dataset_id, &dataset);
        let id = self.next_dataset_id;
        self.next_dataset_id += 1;
        
        env::log_str(&format!("Dataset {} listed by {}", id, env::predecessor_account_id()));
        id
    }

    // ==================== ESCROW PURCHASE SYSTEM ====================

    /// Purchase a dataset - funds go into escrow
    #[payable]
    pub fn purchase_dataset(&mut self, dataset_id: u64) -> String {
        let buyer = env::predecessor_account_id();
        let dataset = self.datasets.get(&dataset_id).expect("Dataset not found");
        let attached = env::attached_deposit();
        
        assert!(attached >= dataset.price, "Insufficient payment");
        assert!(dataset.owner != buyer, "Cannot purchase own dataset");

        // Check if already purchased
        let purchase_key = format!("{}-{}", buyer, dataset_id);
        assert!(!self.purchases.contains_key(&purchase_key), "Already purchased");

        // Calculate fees
        let fee = (dataset.price * self.marketplace_fee_percent as u128) / 100;
        let seller_amount = dataset.price - fee;

        // Create escrow
        let escrow_id = format!("escrow-{}-{}-{}", dataset_id, buyer, env::block_timestamp());
        let now = env::block_timestamp();
        
        let escrow = Escrow {
            escrow_id: escrow_id.clone(),
            dataset_id,
            buyer: buyer.clone(),
            seller: dataset.owner.clone(),
            amount: seller_amount,
            fee,
            status: EscrowStatus::Pending,
            created_at: now,
            release_at: now + self.escrow_period_ns,
            dispute_reason: None,
        };

        self.escrows.insert(&escrow_id, &escrow);

        // Record purchase (pending escrow release)
        let purchase = Purchase {
            dataset_id,
            buyer: buyer.clone(),
            price_paid: dataset.price,
            timestamp: now,
            escrow_released: false,
        };
        self.purchases.insert(&purchase_key, &purchase);

        // Refund excess payment
        if attached > dataset.price {
            Promise::new(buyer.clone()).transfer(attached - dataset.price);
        }

        env::log_str(&format!(
            "Escrow created: {} for dataset {} by buyer {}",
            escrow_id, dataset_id, buyer
        ));

        escrow_id
    }

    /// Buyer confirms receipt and releases escrow to seller
    pub fn confirm_and_release(&mut self, escrow_id: String) -> Promise {
        let caller = env::predecessor_account_id();
        let mut escrow = self.escrows.get(&escrow_id).expect("Escrow not found");
        
        assert_eq!(escrow.buyer, caller, "Only buyer can confirm");
        assert_eq!(escrow.status, EscrowStatus::Pending, "Escrow not pending");

        // Release funds to seller
        escrow.status = EscrowStatus::Released;
        self.escrows.insert(&escrow_id, &escrow);

        // Update purchase record
        let purchase_key = format!("{}-{}", escrow.buyer, escrow.dataset_id);
        if let Some(mut purchase) = self.purchases.get(&purchase_key) {
            purchase.escrow_released = true;
            self.purchases.insert(&purchase_key, &purchase);
        }

        // Increment downloads
        if let Some(mut dataset) = self.datasets.get(&escrow.dataset_id) {
            dataset.downloads += 1;
            self.datasets.insert(&escrow.dataset_id, &dataset);
        }

        env::log_str(&format!("Escrow {} released to seller", escrow_id));

        // Transfer to seller
        Promise::new(escrow.seller).transfer(escrow.amount)
    }

    /// Auto-release escrow after lock period (anyone can call)
    pub fn auto_release(&mut self, escrow_id: String) -> Promise {
        let mut escrow = self.escrows.get(&escrow_id).expect("Escrow not found");
        
        assert_eq!(escrow.status, EscrowStatus::Pending, "Escrow not pending");
        assert!(
            env::block_timestamp() >= escrow.release_at,
            "Escrow period not ended"
        );

        // Auto-release to seller
        escrow.status = EscrowStatus::Released;
        self.escrows.insert(&escrow_id, &escrow);

        // Update purchase and dataset
        let purchase_key = format!("{}-{}", escrow.buyer, escrow.dataset_id);
        if let Some(mut purchase) = self.purchases.get(&purchase_key) {
            purchase.escrow_released = true;
            self.purchases.insert(&purchase_key, &purchase);
        }

        if let Some(mut dataset) = self.datasets.get(&escrow.dataset_id) {
            dataset.downloads += 1;
            self.datasets.insert(&escrow.dataset_id, &dataset);
        }

        env::log_str(&format!("Escrow {} auto-released after period", escrow_id));

        Promise::new(escrow.seller).transfer(escrow.amount)
    }

    /// Buyer raises a dispute
    pub fn raise_dispute(&mut self, escrow_id: String, reason: String) {
        let caller = env::predecessor_account_id();
        let mut escrow = self.escrows.get(&escrow_id).expect("Escrow not found");
        
        assert_eq!(escrow.buyer, caller, "Only buyer can dispute");
        assert_eq!(escrow.status, EscrowStatus::Pending, "Escrow not pending");

        escrow.status = EscrowStatus::Disputed;
        escrow.dispute_reason = Some(reason.clone());
        self.escrows.insert(&escrow_id, &escrow);

        env::log_str(&format!("Dispute raised for escrow {}: {}", escrow_id, reason));
    }

    /// Admin resolves dispute - can refund buyer or release to seller
    pub fn resolve_dispute(&mut self, escrow_id: String, refund_buyer: bool) -> Promise {
        let caller = env::predecessor_account_id();
        assert_eq!(caller, self.owner, "Only owner can resolve disputes");

        let mut escrow = self.escrows.get(&escrow_id).expect("Escrow not found");
        assert_eq!(escrow.status, EscrowStatus::Disputed, "Escrow not disputed");

        if refund_buyer {
            escrow.status = EscrowStatus::Refunded;
            self.escrows.insert(&escrow_id, &escrow);

            // Remove purchase record
            let purchase_key = format!("{}-{}", escrow.buyer, escrow.dataset_id);
            self.purchases.remove(&purchase_key);

            env::log_str(&format!("Escrow {} refunded to buyer", escrow_id));
            
            // Refund full amount to buyer
            Promise::new(escrow.buyer).transfer(escrow.amount + escrow.fee)
        } else {
            escrow.status = EscrowStatus::Released;
            self.escrows.insert(&escrow_id, &escrow);

            // Update purchase
            let purchase_key = format!("{}-{}", escrow.buyer, escrow.dataset_id);
            if let Some(mut purchase) = self.purchases.get(&purchase_key) {
                purchase.escrow_released = true;
                self.purchases.insert(&purchase_key, &purchase);
            }

            if let Some(mut dataset) = self.datasets.get(&escrow.dataset_id) {
                dataset.downloads += 1;
                self.datasets.insert(&escrow.dataset_id, &dataset);
            }

            env::log_str(&format!("Dispute resolved: escrow {} released to seller", escrow_id));
            
            Promise::new(escrow.seller).transfer(escrow.amount)
        }
    }

    // ==================== VIEW METHODS ====================

    pub fn get_dataset(&self, dataset_id: u64) -> Option<Dataset> {
        self.datasets.get(&dataset_id)
    }

    pub fn get_datasets(&self, from_index: u64, limit: u64) -> Vec<Dataset> {
        (from_index..std::cmp::min(from_index + limit, self.next_dataset_id))
            .filter_map(|id| self.datasets.get(&id))
            .collect()
    }

    pub fn verify_purchase(&self, buyer: AccountId, dataset_id: u64) -> bool {
        let key = format!("{}-{}", buyer, dataset_id);
        self.purchases.contains_key(&key)
    }

    pub fn get_escrow(&self, escrow_id: String) -> Option<Escrow> {
        self.escrows.get(&escrow_id)
    }

    pub fn get_escrow_status(&self, escrow_id: String) -> Option<EscrowStatus> {
        self.escrows.get(&escrow_id).map(|e| e.status)
    }

    pub fn get_marketplace_fee(&self) -> u8 {
        self.marketplace_fee_percent
    }

    pub fn get_escrow_period_days(&self) -> u64 {
        self.escrow_period_ns / (24 * 60 * 60 * 1_000_000_000)
    }

    // ==================== ADMIN ====================

    pub fn set_marketplace_fee(&mut self, fee_percent: u8) {
        assert_eq!(env::predecessor_account_id(), self.owner, "Owner only");
        assert!(fee_percent <= 10, "Fee cannot exceed 10%");
        self.marketplace_fee_percent = fee_percent;
    }

    pub fn set_escrow_period(&mut self, days: u64) {
        assert_eq!(env::predecessor_account_id(), self.owner, "Owner only");
        assert!(days >= 1 && days <= 30, "Period must be 1-30 days");
        self.escrow_period_ns = days * 24 * 60 * 60 * 1_000_000_000;
    }

    pub fn withdraw_fees(&mut self, amount: Balance) -> Promise {
        assert_eq!(env::predecessor_account_id(), self.owner, "Owner only");
        Promise::new(self.owner.clone()).transfer(amount)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::testing_env;

    fn get_context(predecessor: AccountId, deposit: Balance) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder
            .predecessor_account_id(predecessor)
            .attached_deposit(deposit);
        builder
    }

    #[test]
    fn test_list_dataset() {
        let context = get_context(accounts(0), 0).build();
        testing_env!(context);

        let mut contract = MarketplaceContract::new(accounts(0));
        let id = contract.list_dataset(
            "Test Dataset".to_string(),
            "Description".to_string(),
            "Computer Vision".to_string(),
            "QmTest123".to_string(),
            false,
            "0x000".to_string(),
            1_000_000_000_000_000_000_000_000, // 1 NEAR
            "MIT".to_string(),
        );

        assert_eq!(id, 0);
        let dataset = contract.get_dataset(0).unwrap();
        assert_eq!(dataset.title, "Test Dataset");
    }

    #[test]
    fn test_purchase_creates_escrow() {
        let seller: AccountId = accounts(0);
        let buyer: AccountId = accounts(1);
        let price: Balance = 1_000_000_000_000_000_000_000_000; // 1 NEAR

        // Seller lists dataset
        let context = get_context(seller.clone(), 0).build();
        testing_env!(context);
        let mut contract = MarketplaceContract::new(accounts(2)); // Admin is accounts(2)
        
        contract.list_dataset(
            "Test Dataset".to_string(),
            "Description".to_string(),
            "AI".to_string(),
            "QmTest123".to_string(),
            true,
            "0xzk".to_string(),
            price,
            "MIT".to_string(),
        );

        // Buyer purchases
        let context = get_context(buyer.clone(), price).build();
        testing_env!(context);
        
        let escrow_id = contract.purchase_dataset(0);
        
        assert!(contract.verify_purchase(buyer.clone(), 0));
        
        let escrow = contract.get_escrow(escrow_id).unwrap();
        assert_eq!(escrow.status, EscrowStatus::Pending);
        assert_eq!(escrow.buyer, buyer);
        assert_eq!(escrow.seller, seller);
    }
}
