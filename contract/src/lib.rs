use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{Vector};
use near_sdk::{env, near_bindgen, setup_alloc, Promise};
use near_sdk::json_types::{U128};

setup_alloc!();

impl Default for PumpnDump {
    fn default() -> Self {
        Self {
            price: 1,
            bids: Vector::new(b"a".to_vec()),
        }
    }
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct PumpnDump {
    price: u128,
    bids: Vector<(u64, String, U128)>,
}

#[near_bindgen]
impl PumpnDump {

    pub fn get_price(&self) -> u128 {
        self.price.clone()
    }

    pub fn buy(&mut self, amount: U128) -> Promise {
        let account_id = "pumpndump.testnet".to_string();
        let timestamp = env::block_timestamp();
        self.price += amount.0*10000000000000000000000;
        self.bids.push(&(timestamp, "Buy".to_string(), near_sdk::json_types::U128::from(self.price)));
        Promise::new(account_id).transfer(amount.0)
    }

    pub fn sell(&mut self, amount: U128) -> Promise {
        let account_id = env::predecessor_account_id();
        let timestamp = env::block_timestamp();
        self.price -= amount.0*10000000000000000000000;
        self.bids.push(&(timestamp, "Sell".to_string(), near_sdk::json_types::U128::from(self.price)));
        Promise::new(account_id).transfer(amount.0)
    }

    pub fn get_bids(&self) -> Vec<(u64, String, u128)> {
        let result: Vec<(u64, String, u128)> = self.bids.iter()
                .map(|(x, y, z)| (x, y, z.0 as u128))
                .collect();
            // result.sort_by(|a, b| b.0.cmp(&a.0));
            result
    }
}
