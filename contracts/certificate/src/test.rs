#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

fn setup() -> (Env, CertificateRegistryClient<'static>, Address) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, CertificateRegistry);
    let client = CertificateRegistryClient::new(&env, &contract_id);
    let admin = Address::generate(&env);
    client.initialize(&admin);
    (env, client, admin)
}

#[test]
fn test_initialize_sets_admin() {
    let (_env, client, admin) = setup();
    assert_eq!(client.get_admin(), Some(admin));
    assert_eq!(client.get_cert_count(), 0u64);
}

#[test]
#[should_panic(expected = "Already initialized")]
fn test_cannot_initialize_twice() {
    let (env, client, _admin) = setup();
    let second_admin = Address::generate(&env);
    client.initialize(&second_admin);
}

#[test]
fn test_issue_certificate_returns_id() {
    let (env, client, _admin) = setup();
    let learner = Address::generate(&env);
    let cert_id = client.issue_certificate(&learner, &1u32);
    assert_eq!(cert_id, 1u64);
    assert_eq!(client.get_cert_count(), 1u64);
}

#[test]
fn test_verify_valid_certificate() {
    let (env, client, _admin) = setup();
    let learner = Address::generate(&env);
    client.issue_certificate(&learner, &1u32);
    assert!(client.verify_certificate(&learner, &1u32));
    // Different course returns false
    assert!(!client.verify_certificate(&learner, &2u32));
}

#[test]
fn test_verify_nonexistent_returns_false() {
    let (env, client, _admin) = setup();
    let stranger = Address::generate(&env);
    assert!(!client.verify_certificate(&stranger, &1u32));
}

#[test]
fn test_get_certificate_details() {
    let (env, client, _admin) = setup();
    let learner = Address::generate(&env);
    let cert_id = client.issue_certificate(&learner, &1u32);
    let cert = client.get_certificate(&learner);
    assert_eq!(cert.wallet, learner);
    assert_eq!(cert.course_id, 1u32);
    assert_eq!(cert.cert_id, cert_id);
    assert!(cert.valid);
}

#[test]
fn test_revoke_certificate() {
    let (env, client, _admin) = setup();
    let learner = Address::generate(&env);
    client.issue_certificate(&learner, &1u32);
    assert!(client.verify_certificate(&learner, &1u32));
    client.revoke_certificate(&learner);
    assert!(!client.verify_certificate(&learner, &1u32));
    let cert = client.get_certificate(&learner);
    assert!(!cert.valid);
}

#[test]
fn test_cert_count_increments_per_learner() {
    let (env, client, _admin) = setup();
    let l1 = Address::generate(&env);
    let l2 = Address::generate(&env);
    let l3 = Address::generate(&env);
    client.issue_certificate(&l1, &1u32);
    client.issue_certificate(&l2, &1u32);
    client.issue_certificate(&l3, &1u32);
    assert_eq!(client.get_cert_count(), 3u64);
}
