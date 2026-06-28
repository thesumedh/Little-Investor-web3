#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

fn setup() -> (Env, AllowanceVaultClient<'static>, Address) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, AllowanceVault);
    let client = AllowanceVaultClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    client.initialize(&owner, &1000i128);
    (env, client, owner)
}

#[test]
fn test_initialize() {
    let (_env, client, owner) = setup();
    let details = client.get_details();
    assert_eq!(details.owner, owner);
    assert_eq!(details.limit, 1000i128);
    assert_eq!(details.balance, 0i128);
    assert_eq!(details.spent_today, 0i128);
}

#[test]
#[should_panic(expected = "Vault already initialized")]
fn test_cannot_initialize_twice() {
    let (env, client, _owner) = setup();
    let second_owner = Address::generate(&env);
    client.initialize(&second_owner, &500i128);
}

#[test]
fn test_set_limit() {
    let (_env, client, _owner) = setup();
    client.set_limit(&2000i128);
    let details = client.get_details();
    assert_eq!(details.limit, 2000i128);
}

#[test]
fn test_save_and_spend() {
    let (_env, client, _owner) = setup();
    client.save(&500i128);
    let mut details = client.get_details();
    assert_eq!(details.balance, 500i128);

    client.spend(&200i128);
    details = client.get_details();
    assert_eq!(details.balance, 300i128);
    assert_eq!(details.spent_today, 200i128);
}

#[test]
#[should_panic(expected = "Spend limit exceeded for today")]
fn test_spend_limit_exceeded() {
    let (_env, client, _owner) = setup();
    client.save(&1500i128);
    client.spend(&1200i128); // limit is 1000
}

#[test]
#[should_panic(expected = "Insufficient savings in vault")]
fn test_spend_insufficient_savings() {
    let (_env, client, _owner) = setup();
    client.spend(&200i128); // balance is 0
}

#[test]
fn test_reset_spent() {
    let (_env, client, _owner) = setup();
    client.save(&500i128);
    client.spend(&200i128);
    assert_eq!(client.get_details().spent_today, 200i128);

    client.reset_spent();
    assert_eq!(client.get_details().spent_today, 0i128);
}
