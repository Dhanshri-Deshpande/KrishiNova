def calculate_water_requirement(temperature, humidity, forecast_rainfall_mm, crop_stage, area_acres, tank_volume_liters):
    """
    Predicts the net water requirement (in Liters) for the next crop cycle days.
    - Uses temperature and humidity to approximate Evapotranspiration (ETc).
    - Uses crop stage as a crop coefficient (Kc).
    - Subtracts expected rainfall.
    - Subtracts available tank volume.
    """
    # 1. Base Evapotranspiration approximation (Simplified Penman-Monteith logic)
    # Higher temp = more evaporation. Higher humidity = less evaporation.
    base_et = max(1.0, (temperature * 0.4) - (humidity * 0.05))
    
    # 2. Crop Coefficient (Kc) depending on stage
    kc_values = {
        'initial': 0.3,
        'development': 0.8,
        'mid_season': 1.15,
        'late_season': 0.7
    }
    kc = kc_values.get(crop_stage.lower(), 0.8)
    
    # 3. Crop Evapotranspiration (ETc) in mm/day
    etc_mm_per_day = base_et * kc
    
    # 4. Total Area in square meters (1 Acre = 4046.86 sq meters)
    area_sqm = area_acres * 4046.86
    
    # 5. Total volume required in Liters per day (1 mm = 1 Liter / sq meter)
    total_water_required_liters = etc_mm_per_day * area_sqm
    
    # 6. Calculate Rainfall contribution (Liters)
    expected_rainfall_liters = forecast_rainfall_mm * area_sqm
    
    # 7. Net requirement after rain
    water_after_rain = max(0, total_water_required_liters - expected_rainfall_liters)
    
    # 8. Net requirement considering tank storage
    net_water_needed = max(0, water_after_rain - tank_volume_liters)
    
    return {
        'total_required_liters': round(total_water_required_liters, 2),
        'expected_rainfall_liters': round(expected_rainfall_liters, 2),
        'water_after_rain_liters': round(water_after_rain, 2),
        'tank_volume_liters': tank_volume_liters,
        'net_water_needed_liters': round(net_water_needed, 2),
        'pump_required': net_water_needed > 0
    }
