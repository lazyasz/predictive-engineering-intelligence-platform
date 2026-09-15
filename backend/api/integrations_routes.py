"""
Integrations API Router: Atlassian Jira Cloud & Notion Workspace Automation.
Handles ticket creation, sprint batch exports, Notion database synchronization,
and real-time ecosystem status checks.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from backend.services.jira_service import (
    get_jira_status,
    create_jira_issue,
    bulk_export_to_jira
)
from backend.services.notion_service import (
    get_notion_status,
    sync_backlog_to_notion,
    create_notion_audit_report
)
from backend.config import settings

router = APIRouter(prefix="/integrations", tags=["Enterprise Integrations (Jira & Notion)"])


# Pydantic Request Models
class JiraIssueRequest(BaseModel):
    component_name: str = Field(..., description="Target software component / file path")
    priority_score: float = Field(..., ge=0.0, le=100.0, description="5D Mathematical Priority Score")
    remediation_effort_hours: float = Field(default=8.0, description="Estimated remediation effort in hours")
    defect_probability: Optional[float] = Field(default=0.45, description="ML Predicted Defect Probability (0-1.0)")
    technical_risk: Optional[float] = Field(default=65.0, description="Technical Risk score (0-100)")
    business_impact: Optional[float] = Field(default=70.0, description="Business Impact score (0-100)")
    roi_quadrant: Optional[str] = Field(default="Quick Wins", description="ROI Matrix Quadrant")
    summary: Optional[str] = None
    issue_type: Optional[str] = "Task"
    explanation: Optional[str] = None


class JiraBulkExportRequest(BaseModel):
    sprint_name: Optional[str] = "Sprint 24 — Technical Debt Remediation"
    components: List[JiraIssueRequest]


class NotionSyncRequest(BaseModel):
    database_id: Optional[str] = None
    components: List[JiraIssueRequest]


class NotionAuditReportRequest(BaseModel):
    title: Optional[str] = "Executive Technical Debt Audit — Q3 2026"
    total_components: Optional[int] = 100
    avg_priority_score: Optional[float] = 64.2
    quick_wins_count: Optional[int] = 24
    critical_hotspots_count: Optional[int] = 12


class IntegrationConfigUpdate(BaseModel):
    google_client_id: Optional[str] = None
    jira_domain: Optional[str] = None
    jira_email: Optional[str] = None
    jira_api_token: Optional[str] = None
    jira_project_key: Optional[str] = None
    notion_api_key: Optional[str] = None
    notion_database_id: Optional[str] = None


@router.get("/status", summary="Get Ecosystem Integration Status")
def get_all_integrations_status():
    """Returns the operational and configuration status of Google OAuth, Jira Cloud, and Notion."""
    return {
        "google_auth": {
            "service": "Google Identity Services (OAuth2)",
            "configured": bool(settings.GOOGLE_CLIENT_ID),
            "client_id": settings.GOOGLE_CLIENT_ID or "SANDBOX_MOCK_CLIENT_ID",
            "mode": "live" if settings.GOOGLE_CLIENT_ID else "sandbox_mock"
        },
        "jira": get_jira_status(),
        "notion": get_notion_status()
    }


@router.post("/config", summary="Update Live Integration Credentials")
def update_integration_config(payload: IntegrationConfigUpdate):
    """Dynamically updates integration credentials at runtime."""
    if payload.google_client_id is not None:
        settings.GOOGLE_CLIENT_ID = payload.google_client_id
    if payload.jira_domain is not None:
        settings.JIRA_DOMAIN = payload.jira_domain
    if payload.jira_email is not None:
        settings.JIRA_EMAIL = payload.jira_email
    if payload.jira_api_token is not None:
        settings.JIRA_API_TOKEN = payload.jira_api_token
    if payload.jira_project_key is not None:
        settings.JIRA_PROJECT_KEY = payload.jira_project_key
    if payload.notion_api_key is not None:
        settings.NOTION_API_KEY = payload.notion_api_key
    if payload.notion_database_id is not None:
        settings.NOTION_DATABASE_ID = payload.notion_database_id

    return {
        "status": "success",
        "message": "Integration configurations successfully updated.",
        "ecosystem_status": get_all_integrations_status()
    }


@router.post("/jira/create-issue", summary="Create Jira Refactoring Issue")
async def create_single_jira_issue(payload: JiraIssueRequest):
    """
    Creates a single Jira Cloud issue for a specific technical debt component with ML defect risk metrics.
    """
    res = await create_jira_issue(payload.model_dump())
    return res


@router.post("/jira/bulk-export", summary="Bulk Export Prioritized Components to Jira Sprint")
async def bulk_export_sprint_to_jira(payload: JiraBulkExportRequest):
    """
    Converts a batch of prioritized debt components into Jira sprint backlog tickets.
    """
    components_dict = [c.model_dump() for c in payload.components]
    res = await bulk_export_to_jira(components_dict, payload.sprint_name)
    return res


@router.post("/notion/sync", summary="Sync Components to Notion Database")
async def sync_to_notion_database(payload: NotionSyncRequest):
    """
    Synchronizes prioritized technical debt items into a live Notion database.
    """
    components_dict = [c.model_dump() for c in payload.components]
    res = await sync_backlog_to_notion(components_dict, payload.database_id)
    return res


@router.post("/notion/create-report", summary="Create Executive Audit Report in Notion")
async def create_audit_report_in_notion(payload: NotionAuditReportRequest):
    """
    Publishes a comprehensive Tech Debt Executive Audit Report to Notion.
    """
    res = await create_notion_audit_report(payload.model_dump())
    return res
