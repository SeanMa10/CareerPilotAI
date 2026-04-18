from pydantic import BaseModel


class FeatureAccessItem(BaseModel):
    used: int
    free_limit: int
    remaining_free_uses: int
    locked: bool


class AccessStatusResponse(BaseModel):
    payments_enabled: bool
    future_plan_price_usd: int
    features: dict[str, FeatureAccessItem]