use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, Vector};
use near_sdk::{env, near_bindgen, setup_alloc};

setup_alloc!();

impl Default for NearvemberCreativityWinners {
    fn default() -> Self {
        Self {
            question: "Select a most creative NEARvember".to_string(),
            candidates: Vector::new(b"c".to_vec()),
            voted: LookupMap::new(b"v".to_vec()),
        }
    }
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct NearvemberCreativityWinners {
    question: String,
    candidates: Vector<(String, u32)>,
    voted: LookupMap<String, String>,
}

#[near_bindgen]
impl NearvemberCreativityWinners {
    pub fn get_question(&self) -> String {
        self.question.clone()
    }

    pub fn add_candidate(&mut self, candidate: String) {
        let cand_list: Vec<String> = self.candidates.iter().map(|(x, _y)| x.clone()).collect();
        assert!(!cand_list.contains(&candidate), "Candidate already exists");
        // Use env::log to record logs permanently to the blockchain!
        env::log(format!("Saving candidate '{}' to candidates", &candidate).as_bytes());
        self.candidates.push(&(candidate, 0));
    }

    pub fn vote(&mut self, candidate: String) -> bool {
        let voter_id = env::predecessor_account_id();
        if self.voted.contains_key(&voter_id) {
            env::log(format!("{} already voted", &voter_id).as_bytes());
            return false;
        }
        env::log(format!("{} is voting", &voter_id).as_bytes());
        self.voted.insert(&voter_id, &String::from(&candidate));

        for i in 0..self.candidates.len() {
            let mut cand = self.candidates.get(i).unwrap();
            if &cand.0 == &candidate {
                cand.1 += 1;
                self.candidates.replace(i, &cand);
            }
        }
        return true;
    }

    pub fn get_vote(&self) -> String {
        let voter_id = env::signer_account_id();
        self.voted.get(&voter_id).unwrap_or(String::from("You did not vote yet"))
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
        let mut winner = self.candidates.get(0).unwrap();
        let mut max_score = winner.1;
        for i in 0..self.candidates.len() {
            let candidate = self.candidates.get(i).unwrap();
            let score = candidate.1;
            if score > max_score {
                winner = candidate;
                max_score = score;
            }
        }
        winner
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
        assert_eq!("Select a most creative NEARvember", question.to_string());
    }

    #[test]
    fn add_and_get_candidate() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = NearvemberCreativityWinners::default();
        contract.add_candidate("Cat".to_string());
        let candidates = contract.get_candidates();
        assert_eq!(true, candidates.len() == 1);
    }

    #[test]
    fn vote() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = NearvemberCreativityWinners::default();
        contract.add_candidate("Cat".to_string());
        let vote = contract.vote("Cat".to_string());
        assert_eq!(true, vote);
    }

    #[test]
    fn voted() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = NearvemberCreativityWinners::default();
        contract.add_candidate("Cat".to_string());
        contract.add_candidate("Dog".to_string());
        let vote1 = contract.vote("Cat".to_string());
        assert_eq!(true, vote1);
        let vote2 = contract.vote("Dog".to_string());
        assert_eq!(false, vote2);
    }

    #[test]
    fn get_winner() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = NearvemberCreativityWinners::default();
        let before = contract.get_winner();
        assert_eq!("No winner selected yet".to_string(), before.0.to_string());
        contract.add_candidate("Dog".to_string());
        let vote = contract.vote("Dog".to_string());
        assert_eq!(true, vote);
        let after = contract.get_winner();
        assert_eq!("Dog".to_string(), after.0.to_string());
        assert_eq!("1".to_string(), after.1.to_string());
    }

    #[test]
    fn get_vote() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = NearvemberCreativityWinners::default();
        let before = contract.get_vote();
        assert_eq!("You did not vote yet".to_string(), before.to_string());
        contract.add_candidate("Dog".to_string());
        let vote = contract.vote("Dog".to_string());
        assert_eq!(true, vote);
        let after = contract.get_vote();
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
