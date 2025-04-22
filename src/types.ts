import { Database } from "./db/database.types";

// Define allowed correction styles
export type CorrectionStyle = "formal" | "natural";

// -----------------------------------------------------------
// Correction DTOs and Command Models
// -----------------------------------------------------------

/**
 * Command model for creating a correction.
 * Contains only the required properties for creating a correction.
 */
export type CreateCorrectionCommand = {
  original_text: string;
  correction_style: CorrectionStyle;
};

/**
 * DTO representing a correction record.
 * Derived from the database model for corrections with a restricted correction_style.
 */
export type CorrectionDTO = Omit<Database["public"]["Tables"]["corrections"]["Row"], "correction_style"> & {
  correction_style: CorrectionStyle;
};

/**
 * Response DTO for retrieving a list of corrections.
 */
export type GetCorrectionsResponseDTO = CorrectionDTO[];

/**
 * Response DTO for retrieving a single correction detail.
 */
export type GetCorrectionResponseDTO = CorrectionDTO;

/**
 * Command model for generating a correction proposal.
 */
export type GenerateCorrectionProposalCommand = {
  original_text: string;
  denied_proposed_text?: string;
  correction_style: CorrectionStyle;
};

/**
 * DTO for the response of generating a correction proposal.
 */
export type GenerateCorrectionProposalResponseDTO = {
  original_text: string;
  proposed_text: string;
  correction_style: CorrectionStyle;
  educational_comment: string;
};

/**
 * DTO for the response of deleting a correction.
 */
export type DeleteCorrectionResponseDTO = {
  message: string;
};

// -----------------------------------------------------------
// User Settings DTOs and Command Models
// -----------------------------------------------------------

/**
 * DTO representing user settings.
 * Derived from the database model for user_settings with a restricted default_correction_style.
 */
export type UserSettingsDTO = Omit<Database["public"]["Tables"]["user_settings"]["Row"], "default_correction_style"> & {
  default_correction_style: CorrectionStyle;
};

/**
 * Command model for updating user settings.
 */
export type UpdateUserSettingsCommand = {
  default_correction_style: CorrectionStyle;
};

/**
 * Response DTO for fetching user settings.
 */
export type GetUserSettingsResponseDTO = UserSettingsDTO;

/**
 * Response DTO for updating user settings.
 */
export type UpdateUserSettingsResponseDTO = UserSettingsDTO; 