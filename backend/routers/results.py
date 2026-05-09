from fastapi import APIRouter, HTTPException
import database as db

router = APIRouter(prefix="/api/results", tags=["results"])


@router.get("/{session_id}")
async def get_results(session_id: str):
    """Get the results for a completed interview session."""
    result = db.get_result(session_id)
    if not result:
        raise HTTPException(status_code=404, detail="Results not found for this session")
    return result
