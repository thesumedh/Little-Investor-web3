#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, Symbol, Address};

#[contracttype]
#[derive(Clone)]
pub struct VaultDetails {
    pub owner: Address,
    pub limit: i128,
    pub balance: i128,
    pub spent_today: i128,
}

const OWNER: Symbol = symbol_short!("OWNER");
const LIMIT: Symbol = symbol_short!("LIMIT");
const SAVED: Symbol = symbol_short!("SAVED");
const SPENT: Symbol = symbol_short!("SPENT");

#[contract]
pub struct AllowanceVault;

#[contractimpl]
impl AllowanceVault {
    pub fn initialize(env: Env, owner: Address, limit: i128) {
        if env.storage().instance().has(&OWNER) {
            panic!("Vault already initialized");
        }
        env.storage().instance().set(&OWNER, &owner);
        env.storage().instance().set(&LIMIT, &limit);
        env.storage().instance().set(&SAVED, &0i128);
        env.storage().instance().set(&SPENT, &0i128);
    }

    pub fn set_limit(env: Env, limit: i128) {
        let owner: Address = env.storage().instance().get(&OWNER).unwrap();
        owner.require_auth();
        env.storage().instance().set(&LIMIT, &limit);
    }

    pub fn save(env: Env, amount: i128) {
        let owner: Address = env.storage().instance().get(&OWNER).unwrap();
        owner.require_auth();
        let current_saved: i128 = env.storage().instance().get(&SAVED).unwrap_or(0);
        env.storage().instance().set(&SAVED, &(current_saved + amount));
    }

    pub fn spend(env: Env, amount: i128) {
        let owner: Address = env.storage().instance().get(&OWNER).unwrap();
        owner.require_auth();
        
        let limit: i128 = env.storage().instance().get(&LIMIT).unwrap_or(0);
        let spent: i128 = env.storage().instance().get(&SPENT).unwrap_or(0);
        
        if spent + amount > limit {
            panic!("Spend limit exceeded for today");
        }
        
        let current_saved: i128 = env.storage().instance().get(&SAVED).unwrap_or(0);
        if current_saved < amount {
            panic!("Insufficient savings in vault");
        }
        
        env.storage().instance().set(&SAVED, &(current_saved - amount));
        env.storage().instance().set(&SPENT, &(spent + amount));
    }

    pub fn reset_spent(env: Env) {
        let owner: Address = env.storage().instance().get(&OWNER).unwrap();
        owner.require_auth();
        env.storage().instance().set(&SPENT, &0i128);
    }

    pub fn get_details(env: Env) -> VaultDetails {
        let owner: Address = env.storage().instance().get(&OWNER).unwrap();
        let limit: i128 = env.storage().instance().get(&LIMIT).unwrap_or(0);
        let saved: i128 = env.storage().instance().get(&SAVED).unwrap_or(0);
        let spent: i128 = env.storage().instance().get(&SPENT).unwrap_or(0);
        
        VaultDetails {
            owner,
            limit,
            balance: saved,
            spent_today: spent,
        }
    }
}

mod test;
