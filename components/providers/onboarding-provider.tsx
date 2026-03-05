"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  OnboardingState,
  OnboardingStep,
  BusinessDetailsFormData,
  AddressDetailsFormData,
} from "@/types/onboarding";

const STORAGE_KEY = "complyremit_onboarding";

const initialState: OnboardingState = {
  currentStep: "business-details",
  businessDetails: null,
  addressDetails: null,
  signedAgreementId: null,
  isComplete: false,
};

type Action =
  | { type: "SET_BUSINESS_DETAILS"; payload: BusinessDetailsFormData }
  | { type: "SET_ADDRESS_DETAILS"; payload: AddressDetailsFormData }
  | { type: "SET_STEP"; payload: OnboardingStep }
  | { type: "SET_SIGNED_AGREEMENT"; payload: string }
  | { type: "SET_COMPLETE" }
  | { type: "HYDRATE"; payload: OnboardingState }
  | { type: "RESET" };

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case "SET_BUSINESS_DETAILS":
      return {
        ...state,
        businessDetails: action.payload,
        currentStep: "address-details",
      };
    case "SET_ADDRESS_DETAILS":
      return {
        ...state,
        addressDetails: action.payload,
        currentStep: "tos",
      };
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "SET_SIGNED_AGREEMENT":
      return { ...state, signedAgreementId: action.payload };
    case "SET_COMPLETE":
      return { ...state, isComplete: true };
    case "HYDRATE":
      return action.payload;
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface OnboardingContextValue {
  state: OnboardingState;
  setBusinessDetails: (data: BusinessDetailsFormData) => void;
  setAddressDetails: (data: AddressDetailsFormData) => void;
  setStep: (step: OnboardingStep) => void;
  setSignedAgreement: (id: string) => void;
  setComplete: () => void;
  reset: () => void;
  isHydrated: boolean;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isHydratedRef = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Need useState import
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      // ignore
    }
    isHydratedRef.current = true;
    setIsHydrated(true);
  }, []);

  // Persist on state changes (skip initial + hydration)
  useEffect(() => {
    if (isHydratedRef.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  return (
    <OnboardingContext.Provider
      value={{
        state,
        setBusinessDetails: (data) =>
          dispatch({ type: "SET_BUSINESS_DETAILS", payload: data }),
        setAddressDetails: (data) =>
          dispatch({ type: "SET_ADDRESS_DETAILS", payload: data }),
        setStep: (step) => dispatch({ type: "SET_STEP", payload: step }),
        setSignedAgreement: (id) =>
          dispatch({ type: "SET_SIGNED_AGREEMENT", payload: id }),
        setComplete: () => dispatch({ type: "SET_COMPLETE" }),
        reset: () => {
          localStorage.removeItem(STORAGE_KEY);
          dispatch({ type: "RESET" });
        },
        isHydrated,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      "useOnboarding must be used within an OnboardingProvider"
    );
  }
  return context;
}
