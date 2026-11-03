import {
    isValidPhoneNumber,
    parsePhoneNumberFromString,
} from "libphonenumber-js/mobile";
import type { CountryCode } from "libphonenumber-js";
import countries from "./countries.json";

export type CountryEntry = {
    name: string;
    flag: string;
    code: string;
    dial_code: string;
};

const list = countries as CountryEntry[];

export const CONTACT_COUNTRIES = list;

export const SORTED_CONTACT_COUNTRIES = [...list].sort((a, b) =>
    a.name.localeCompare(b.name),
);

export const DEFAULT_CONTACT_COUNTRY =
    list.find((c) => c.code === "IN") ?? list[0];

export type ContactPhoneValidationResult =
    | { ok: true; e164: string }
    | { ok: false; error: string };

export function validateContactPhone(
    nationalDigits: string,
    selectedCountry: CountryEntry,
): ContactPhoneValidationResult {
    if (!nationalDigits) {
        return { ok: false, error: "Please enter your phone number" };
    }

    const countryCode = selectedCountry.code as CountryCode;

    if (countryCode === "IN") {
        if (nationalDigits.length !== 10) {
            return {
                ok: false,
                error: "Indian mobile numbers must be exactly 10 digits (without +91).",
            };
        }
        if (!/^[6-9]\d{9}$/.test(nationalDigits)) {
            return {
                ok: false,
                error: "Enter a valid Indian mobile number (10 digits, starting with 6, 7, 8, or 9).",
            };
        }
    }

    if (!isValidPhoneNumber(nationalDigits, countryCode)) {
        return {
            ok: false,
            error: `Enter a valid mobile number for ${selectedCountry.name} (${selectedCountry.dial_code})`,
        };
    }

    if (nationalDigits.length >= 10) {
        const first = nationalDigits[0];
        if (nationalDigits.split("").every((d) => d === first)) {
            return { ok: false, error: "Please enter a valid phone number" };
        }
    }

    const parsed = parsePhoneNumberFromString(nationalDigits, countryCode);
    if (!parsed) {
        return {
            ok: false,
            error: `Enter a valid mobile number for ${selectedCountry.name} (${selectedCountry.dial_code})`,
        };
    }

    return { ok: true, e164: parsed.number };
}
