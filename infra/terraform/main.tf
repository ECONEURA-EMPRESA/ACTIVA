
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.51.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# 1. ENABLE APIS
# --------------------------------------------------------------------------------------------------
resource "google_project_service" "run" {
  service = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "firestore" {
  service = "firestore.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "artifactregistry" {
  service = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "iam" {
  service = "iam.googleapis.com"
  disable_on_destroy = false
}



resource "google_project_service" "cloudbuild" {
  service = "cloudbuild.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "identitytoolkit" {
  service = "identitytoolkit.googleapis.com"
  disable_on_destroy = false
}





# 2. ARTIFACT REGISTRY
# --------------------------------------------------------------------------------------------------
resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "crm-repo"
  description   = "Docker repository for CRM Backend"
  format        = "DOCKER"

  depends_on = [google_project_service.artifactregistry]
}

# 3. FIRESTORE NATIVE DATABASE
# --------------------------------------------------------------------------------------------------
# Note: Usually this is created once per project as '(default)'. 
# Terraform can manage it if it doesn't exist.
resource "google_firestore_database" "database" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.firestore]
}

# 4. CLOUD RUN SERVICE (BACKEND)
# --------------------------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "backend" {
  name     = "crm-api-prod"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      # Initial placeholder image. CI/CD will update this to the real image from Artifact Registry.
      # We use ignore_changes to prevent Terraform from reverting the image on subsequent runs.
      image = "us-docker.pkg.dev/cloudrun/container/hello" 
      
      ports {
        container_port = 8080
      }

      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }
      
      # Add other necessary env vars here, e.g. from Secret Manager in a real enterprise setup
      # env {
      #   name = "API_KEY"
      #   value_source {
      #     secret_key_ref {
      #       secret = "my-secret"
      #       version = "latest"
      #     }
      #   }
      # }
      
      resources {
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      client,
      client_version,
    ]
  }

  depends_on = [google_project_service.run]
}

# 5. IAM / PUBLIC ACCESS
# --------------------------------------------------------------------------------------------------
resource "google_cloud_run_service_iam_binding" "public_access" {
  location = google_cloud_run_v2_service.backend.location
  service  = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}

# OUTPUTS
# --------------------------------------------------------------------------------------------------
output "api_endpoint" {
  value = google_cloud_run_v2_service.backend.uri
}

output "repository_url" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.repo.name}"
}
