// /// An example of a module on Sui which sells "Phones".
// module zk_escrow::merchant {
//     use sui::transfer_policy::{Self, TransferRequest};
//     use sui::tx_context::TxContext;
//     use sui::object::{Self, UID};

//     use zk_escrow::vat::VAT;

//     /// A single "Phone" - a Sui Object.
//     struct Phone has key, store {
//         id: UID,
//     }

//     /// A price of a single "Phone".
//     const PHONE_PRICE: u64 = 10_000_000_000;

//     /// Some merchant ID (usually represented by a Sui Object)
//     const MERCHANT_ID: address = 0xBEEF;

//     /// The merchant is selling phones, the buyer only pays to the merchant the
//     /// price of the phone, and the tax is paid separately and directly to the
//     /// tax authority. `VAT` type is imported and can only be resolved by the
//     /// authority defining this type.
//     public fun buy_phone(ctx: &mut TxContext): (Phone, TransferRequest<VAT>) {
//         let phone = Phone {
//             id: object::new(ctx),
//         };

//         // Generate new `TransferRequest` for the `VAT` type, specify the ID
//         // of the `Phone` object, the price of the `Phone` and the ID of the
//         // merchant.
//         let request = transfer_policy::new_request<VAT>(
//             object::id(&phone),
//             PHONE_PRICE,
//             object::id_from_address(MERCHANT_ID),
//         );

//         (phone, request)
//     }
// }
