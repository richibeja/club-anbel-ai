export interface Member {
  id: string;
  telegram_id: string;
  telegram_username?: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  email?: string;
  membership_status: 'active' | 'inactive' | 'suspended' | 'expelled';
  membership_type: 'weekly' | 'monthly';
  payment_method_preference?: 'zelle' | 'cash_app' | 'venmo' | 'paypal' | 'bank_transfer' | 'prepaid_card' | 'crypto';
  payment_details?: string; // Email, teléfono, $cashtag, @username según método
  club_role?: 'president' | 'vice_president' | 'treasurer' | 'secretary' | 'predictions_coordinator' | 'vocal_1' | 'vocal_2' | 'member';
  role_start_date?: string;
  profile_photo_url?: string;
  bio?: string;
  // Sistema de Referidos
  referral_code?: string; // Código único: ANBEL-12345
  referred_by?: string; // ID del miembro que lo refirió
  referred_by_code?: string; // Código usado al registrarse
  referrals_count?: number; // Total de referidos activos
  referrals?: string[]; // IDs de miembros referidos
  free_weeks_earned?: number; // Semanas gratis acumuladas
  free_weeks_used?: number; // Semanas gratis ya usadas
  referral_discount_applied?: boolean; // Si usó descuento de nuevo miembro
  joined_date: string;
  last_payment_date?: string;
  next_payment_due?: string;
  total_paid: number;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  lottery_type: 'Powerball' | 'MegaMillions' | 'EuroMillions';
  numbers: number[];
  powerball?: number;
  megaball?: number;
  lucky_stars?: number[];
  draw_date: string;
  assigned_to?: string;
  assigned_member_name?: string;
  created_at: string;
  status: 'available' | 'assigned' | 'used';
}

export interface Ticket {
  id: string;
  member_id: string;
  member_name: string;
  telegram_id: string;
  prediction_id: string;
  prediction_numbers: number[];
  lottery_type: string;
  photo_url: string;
  photo_id: string;
  upload_date: string;
  draw_date: string;
  verified: boolean;
  result?: 'pending' | 'no_win' | 'small_win' | 'big_win';
  prize_amount?: number;
  created_at: string;
}

export interface Payment {
  id: string;
  member_id: string;
  member_name: string;
  amount: number;
  currency: 'USD';
  payment_method: 'zelle' | 'cash_app' | 'venmo' | 'paypal' | 'bank_transfer' | 'prepaid_card' | 'crypto' | 'remittance' | 'hotmart';
  payment_proof_url?: string;
  status: 'pending' | 'verified' | 'rejected';
  payment_date: string;
  verified_by?: string;
  verified_date?: string;
  notes?: string;
  created_at: string;
}

export interface DrawResult {
  id: string;
  lottery_type: string;
  draw_date: string;
  winning_numbers: number[];
  powerball?: number;
  megaball?: number;
  lucky_stars?: number[];
  jackpot_amount: number;
  winners_count: number;
  club_winners: string[];
  created_at: string;
}

export interface PredictionBatch {
  id: string;
  lottery_type: string;
  draw_date: string;
  total_predictions: number;
  assigned_count: number;
  available_count: number;
  created_at: string;
  created_by: string;
}

export interface PrizeDistribution {
  id: string;
  winner_member_id: string;
  winner_member_name: string;
  total_prize: number;
  per_member_share: number; // Prize ÷ number of active members (EQUAL PARTS)
  total_active_members: number;
  lottery_type: string;
  draw_date: string;
  ticket_id: string;
  deposit_received: boolean;
  deposit_date?: string;
  deposit_proof_url?: string;
  distributions: MemberPayout[];
  status: 'pending_deposit' | 'distributing' | 'completed' | 'cancelled';
  created_at: string;
  completed_at?: string;
}

export interface MemberPayout {
  member_id: string;
  member_name: string;
  amount: number;
  payment_method: string;
  payment_details: string;
  status: 'pending' | 'sent' | 'completed' | 'failed';
  transaction_id?: string;
  sent_date?: string;
  proof_url?: string;
}

export interface ClubDirective {
  id: string;
  member_id: string;
  member_name: string;
  role: 'president' | 'vice_president' | 'treasurer' | 'secretary' | 'predictions_coordinator' | 'vocal_1' | 'vocal_2';
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed';
  achievements?: string[];
  message?: string;
  photo_url?: string;
  created_at: string;
}

export interface ClubVote {
  id: string;
  title: string;
  description: string;
  vote_type: 'election' | 'decision' | 'proposal';
  options: VoteOption[];
  start_date: string;
  end_date: string;
  status: 'active' | 'closed' | 'cancelled';
  eligible_voters: string[]; // member_ids
  votes_cast: VoteCast[];
  created_by: string;
  created_at: string;
}

export interface VoteOption {
  id: string;
  text: string;
  votes: number;
}

export interface VoteCast {
  member_id: string;
  option_id: string;
  timestamp: string;
}

export interface ClubReport {
  id: string;
  report_type: 'financial' | 'membership' | 'predictions' | 'general';
  month: string;
  year: number;
  created_by: string;
  created_by_role: string;
  content: string;
  data: any;
  published: boolean;
  published_date?: string;
  created_at: string;
}

