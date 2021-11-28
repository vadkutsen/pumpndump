use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap};
use near_sdk::{env, near_bindgen, setup_alloc};

setup_alloc!();

impl Default for NearvemberCreativityWinners {
    fn default() -> Self {
        Self {
            question: "Select a most creative NEARvemberer".to_string(),
            candidates: UnorderedMap::new(b"c"),
            voted: UnorderedMap::new(b"v"),
        }
    }
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct NearvemberCreativityWinners {
    question: String,
    candidates: UnorderedMap<String, u32>,
    voted: UnorderedMap<String, String>,
}

#[near_bindgen]
impl NearvemberCreativityWinners {
    pub fn get_question(&self) -> String {
        self.question.clone()
    }

    pub fn add_candidate(&mut self, candidate: String) -> String {
        if !self.candidates.get(&candidate).is_none() {
            return format!("Candidate {} already exists", candidate);
        }
        // Use env::log to record logs permanently to the blockchain!
        env::log(format!("Saving candidate '{}' to candidates", &candidate).as_bytes());
        self.candidates.insert(&candidate, &0);
        return format!("{} added to candidates", &candidate);
    }

    pub fn vote(&mut self, candidate: String) -> String {
        let voter_id = env::predecessor_account_id();
        if self.candidates.get(&candidate).is_none(){
            return format!("Candidate {} not found", &candidate);
        }
        if !self.voted.get(&voter_id).is_none() {
            env::log(format!("{} already voted", &voter_id).as_bytes());
            return format!("Account {} already voted", &voter_id);
        }
        env::log(format!("{} is voting", &voter_id).as_bytes());
        let mut val = self.candidates.get(&candidate).unwrap();
        val += 1;
        self.candidates.insert(&candidate, &val);
        self.voted.insert(&voter_id, &candidate);
        return format!("Your vote for {} accepted", &candidate);
    }

    pub fn get_vote(&self, account_id: String ) -> String {
        self.voted.get(&account_id).unwrap_or(String::from("It's time to vote!"))
    }

    pub fn get_candidates(&self) -> Vec<(u32, String, u32)> {
        let mut result: Vec<(u32, String, u32)> = self.candidates.iter().enumerate()
            .map(|(idx, row)| (idx as u32, row.0, row.1))
            .collect();
        result.sort_by(|a, b| b.2.cmp(&a.2));
        result
    }

    pub fn get_winner(&self) -> (String, u32) {
        if self.candidates.len() == 0 {
            return ("No winner selected yet".to_string(), 0);
        }
        let keys = self.candidates.keys_as_vector();
        let values = self.candidates.values_as_vector();
        let mut max_score = 0;
        let mut winner = String::from("");
        for i in 0..self.candidates.len() {
            let key = keys.get(i).unwrap();
            let value = values.get(i).unwrap();
            if value > max_score {
                winner = key;
                max_score = value;
            }
        }
        return (winner, max_score);
    }
}

#[cfg(not(target_arch = "wasm32"))]
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            epoch_height: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
        }
    }

    #[test]
    fn get_question() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let contract = NearvemberCreativityWinners::default();
        let question = contract.get_question();
        assert_eq!("Select a most creative NEARvemberer", question.to_string());
    }

    #[test]
    fn add_and_get_candidate() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = NearvemberCreativityWinners::default();
        let response = contract.add_candidate("Cat".to_string());
        assert_eq!("Cat added to candidates".to_string(), response);
        let candidates = contract.get_candidates();
        assert_eq!(1, candidates.len());
        let response2 = contract.add_candidate("Cat".to_string());
        assert_eq!("Candidate Cat already exists".to_string(), response2);
        let candidates = contract.get_candidates();
        assert_eq!(1, candidates.len());
    }

    #[test]
    fn vote() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = NearvemberCreativityWinners::default();
        contract.add_candidate("Dog".to_string());
        let vote = contract.vote("Dog".to_string());
        assert_eq!("Your vote for Dog accepted".to_string(), vote);
        let vote = contract.vote("Dog".to_string());
        assert_eq!("Account carol_near already voted".to_string(), vote);
    }


    #[test]
    fn get_winner() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = NearvemberCreativityWinners::default();
        let before = contract.get_winner();
        assert_eq!("No winner selected yet".to_string(), before.0.to_string());
        contract.add_candidate("Dog".to_string());
        contract.vote("Dog".to_string());
        let after = contract.get_winner();
        assert_eq!("Dog".to_string(), after.0.to_string());
        assert_eq!("1".to_string(), after.1.to_string());
    }

    #[test]
    fn get_vote() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = NearvemberCreativityWinners::default();
        let before = contract.get_vote("carol_near".to_string());
        assert_eq!("It's time to vote!".to_string(), before.to_string());
        contract.add_candidate("Dog".to_string());
        contract.vote("Dog".to_string());
        let after = contract.get_vote("carol_near".to_string());
        assert_eq!("Dog".to_string(), after.to_string());
    }

    #[test]
    fn get_candidates() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = NearvemberCreativityWinners::default();
        contract.add_candidate("Dog".to_string());
        contract.add_candidate("Cat".to_string());
        contract.vote("Dog".to_string());
        let candidates = contract.get_candidates();
        let expected = vec![
            (0, "Dog".to_string(), 1),
            (1, "Cat".to_string(), 0),
        ];
        assert_eq!(expected, candidates);
    }
}
