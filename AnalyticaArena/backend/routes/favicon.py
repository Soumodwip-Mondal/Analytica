from fastapi import APIRouter
from fastapi.responses import Response

router = APIRouter()

@router.get("/favicon.ico")
async def favicon():
    return Response(status_code=204)
