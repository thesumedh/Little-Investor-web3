#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env};

#[contract]
pub struct AllowanceVault;

#[contractimpl]
impl AllowanceVault {
    // Initialize the contract with parent and child addresses and daily spending limit
    pub fn initialize(env: Env, parent: Address, child: Address, daily_limit: i128) {
        if env.storage().instance().has(&symbol_short!("parent")) {
            panic!("already initialized");
        }
        env.storage().instance().set(&symbol_short!("parent"), &parent);
        env.storage().instance().set(&symbol_short!("child"), &child);
        env.storage().instance().set(&symbol_short!("limit"), &daily_limit);
        env.storage().instance().set(&symbol_short!("spent"), &0i128);
        env.storage().instance().set(&symbol_short!("saved"), &0i128);
    }

    // Set/update the daily spending limit (parent only)
    pub fn set_limit(env: Env, limit: i128) {
        let parent: Address = env.storage().instance().get(&symbol_short!("parent")).unwrap();
        parent.require_auth();
        env.storage().instance().set(&symbol_short!("limit"), &limit);
    }

    // Record saving amount (simulated saving goal tracking)
    pub fn save(env: Env, amount: i128) {
        let child: Address = env.storage().instance().get(&symbol_short!("child")).unwrap();
        child.require_auth();
        let mut saved: i128 = env.storage().instance().get(&symbol_short!("saved")).unwrap_or(0);
        saved += amount;
        env.storage().instance().set(&symbol_short!("saved"), &saved);
    }

    // Verify limit and record withdrawal / spending
    pub fn spend(env: Env, amount: i128) {
        let child: Address = env.storage().instance().get(&symbol_short!("child")).unwrap();
        child.require_auth();
        
        let limit: i128 = env.storage().instance().get(&symbol_short!("limit")).unwrap();
        let mut spent: i128 = env.storage().instance().get(&symbol_short!("spent")).unwrap_or(0);
        
        if spent + amount > limit {
            panic!("spending limit exceeded");
        }
        
        spent += amount;
        env.storage().instance().set(&symbol_short!("spent"), &spent);
    }

    // Reset spent amount (parent only, simulating a new day)
    pub fn reset_spent(env: Env) {
        let parent: Address = env.storage().instance().get(&symbol_short!("parent")).unwrap();
        parent.require_auth();
        env.storage().instance().set(&symbol_short!("spent"), &0i128);
    }

    // Get contract details
    pub fn get_details(env: Env) -> (Address, Address, i128, i128, i128) {
        let parent: Address = env.storage().instance().get(&symbol_short!("parent")).unwrap();
        let child: Address = env.storage().instance().get(&symbol_short!("child")).unwrap();
        let limit: i128 = env.storage().instance().get(&symbol_short!("limit")).unwrap_or(0);
        let spent: i128 = env.storage().instance().get(&symbol_short!("spent")).unwrap_or(0);
        let saved: i128 = env.storage().instance().get(&symbol_short!("saved")).unwrap_or(0);
        (parent, child, limit, spent, saved)
    }
}
