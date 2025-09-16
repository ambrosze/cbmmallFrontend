export interface UserProfileTopLevel {
  data: UserProfileData;
  status: string;
  message: string;
}

export interface UserProfileData {
  id: string;
  first_name: string;
  middle_name: null;
  last_name: string;
  preferred_name: null;
  dialing_code: null;
  phone_number: null;
  phone_number_verified_at: null;
  email: string;
  email_verified_at: string;
  kyc_status: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  referrer_user_id: null;
  profile_photo_url: string;
  wallet: Wallet;
  referral_code: ReferralCode;
  is_admin: boolean;
  roles: Role[];
}
export interface Role {
  id: string;
  name: string;
  guard_name: string;
  created_at: Date;
  updated_at: Date;
  pivot: Pivot;
}

export interface Pivot {
  model_type: string;
  model_id: string;
  role_id: string;
}
export interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  balance: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}
