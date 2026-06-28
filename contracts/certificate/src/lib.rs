#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, Symbol,
};

// ─── Data Structures ────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct Certificate {
    pub wallet: Address,
    pub course_id: u32,
    pub cert_id: u64,
    pub issued_at: u64,
    pub valid: bool,
}

// Storage keys
const CERT_COUNT: Symbol = symbol_short!("CERT_CNT");
const ADMIN: Symbol     = symbol_short!("ADMIN");

// ─── Contract ────────────────────────────────────────────────────────────────

#[contract]
pub struct CertificateRegistry;

#[contractimpl]
impl CertificateRegistry {
    /// Initialize the registry. Can only be called once.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&ADMIN) {
            panic!("Already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&CERT_COUNT, &0u64);
    }

    /// Issue a certificate for a wallet. Only admin can call.
    /// Returns the new certificate ID.
    pub fn issue_certificate(env: Env, wallet: Address, course_id: u32) -> u64 {
        let admin: Address = env
            .storage()
            .instance()
            .get(&ADMIN)
            .unwrap_or_else(|| panic!("Not initialized"));
        admin.require_auth();

        let cert_key = (symbol_short!("CERT"), wallet.clone());

        // Prevent double-issue for same course
        if env.storage().persistent().has(&cert_key) {
            let existing: Certificate = env.storage().persistent().get(&cert_key).unwrap();
            if existing.valid && existing.course_id == course_id {
                panic!("Certificate already issued");
            }
        }

        // Increment counter
        let cert_id: u64 = env
            .storage()
            .instance()
            .get(&CERT_COUNT)
            .unwrap_or(0u64)
            + 1;
        env.storage().instance().set(&CERT_COUNT, &cert_id);

        let cert = Certificate {
            wallet: wallet.clone(),
            course_id,
            cert_id,
            issued_at: env.ledger().timestamp(),
            valid: true,
        };

        // Store certificate in persistent storage
        env.storage().persistent().set(&cert_key, &cert);

        cert_id
    }

    /// Returns true if wallet has a valid certificate for the given course.
    pub fn verify_certificate(env: Env, wallet: Address, course_id: u32) -> bool {
        let cert_key = (symbol_short!("CERT"), wallet.clone());
        if !env.storage().persistent().has(&cert_key) {
            return false;
        }
        let cert: Certificate = env.storage().persistent().get(&cert_key).unwrap();
        cert.valid && cert.course_id == course_id
    }

    /// Returns the full certificate record, or panics if not found.
    pub fn get_certificate(env: Env, wallet: Address) -> Certificate {
        let cert_key = (symbol_short!("CERT"), wallet.clone());
        env.storage()
            .persistent()
            .get(&cert_key)
            .unwrap_or_else(|| panic!("Certificate not found"))
    }

    /// Revoke a certificate. Only admin can call.
    pub fn revoke_certificate(env: Env, wallet: Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&ADMIN)
            .unwrap_or_else(|| panic!("Not initialized"));
        admin.require_auth();

        let cert_key = (symbol_short!("CERT"), wallet.clone());
        let mut cert: Certificate = env
            .storage()
            .persistent()
            .get(&cert_key)
            .unwrap_or_else(|| panic!("Certificate not found"));
        cert.valid = false;
        env.storage().persistent().set(&cert_key, &cert);
    }

    /// Total certificates issued.
    pub fn get_cert_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&CERT_COUNT)
            .unwrap_or(0u64)
    }

    /// Admin address.
    pub fn get_admin(env: Env) -> Option<Address> {
        env.storage().instance().get(&ADMIN)
    }
}

mod test;
