
variable "project_id" {
  description = "The ID of the GCP project"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "europe-west1" # Changed default to match user's preference if Europe
}

variable "environment" {
  description = "The deployment environment (dev, prod)"
  type        = string
  default     = "prod"
}
