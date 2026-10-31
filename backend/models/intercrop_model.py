def get_intercrop_recommendation(primary_crop):
    """
    Recommends suitable inter-crops based on the primary crop predicted.
    Uses companion planting principles (e.g., complementary nutrient uptake).
    """
    intercrop_matrix = {
        'rice': ['Azolla', 'Fish', 'Legumes (Moong)'],
        'maize': ['Soybean', 'Cowpea', 'Groundnut', 'Beans'],
        'chickpea': ['Wheat', 'Mustard', 'Barley'],
        'cotton': ['Green gram', 'Black gram', 'Groundnut'],
        'pigeonpeas': ['Sorghum', 'Maize', 'Pearl millet'],
        'lentil': ['Wheat', 'Mustard'],
        'banana': ['Cowpea', 'Radish', 'Marigold'],
        'mango': ['Papaya', 'Guava', 'Vegetables (initial years)'],
        'grapes': ['Cowpea', 'French beans'],
        'watermelon': ['Onion', 'Garlic', 'Radish'],
        'apple': ['Clover', 'Marigold', 'Garlic'],
        'coffee': ['Black pepper', 'Cardamom', 'Citrus'],
    }
    
    crop_lower = primary_crop.lower()
    return intercrop_matrix.get(crop_lower, ['Legumes (for nitrogen fixation)', 'Marigold (for pest control)'])

def get_crop_metadata(primary_crop):
    """
    Returns the recommended fertilizer and average days to harvest for a given crop.
    """
    metadata = {
        'rice': {'fertilizer': 'NPK 100:50:50 - split nitrogen across stages', 'days_to_harvest': 120},
        'maize': {'fertilizer': 'NPK 120:60:40 - high nitrogen requirement', 'days_to_harvest': 100},
        'chickpea': {'fertilizer': 'NPK 20:40:20 - mainly phosphorus', 'days_to_harvest': 110},
        'cotton': {'fertilizer': 'NPK 120:60:60 - split application', 'days_to_harvest': 160},
        'pigeonpeas': {'fertilizer': 'NPK 25:50:25 - starter dose only', 'days_to_harvest': 150},
        'lentil': {'fertilizer': 'NPK 20:40:20', 'days_to_harvest': 110},
        'banana': {'fertilizer': 'NPK 200:100:300 - high potassium needed', 'days_to_harvest': '10-12 Months'},
        'mango': {'fertilizer': 'NPK 1000:500:1000 g/tree/year', 'days_to_harvest': '3-5 Years'},
        'grapes': {'fertilizer': 'NPK 500:500:1000 g/vine', 'days_to_harvest': '1-2 Years'},
        'watermelon': {'fertilizer': 'NPK 100:50:50', 'days_to_harvest': 85},
        'apple': {'fertilizer': 'NPK 700:350:700 g/tree', 'days_to_harvest': '3-4 Years'},
        'coffee': {'fertilizer': 'NPK 150:75:150 kg/ha', 'days_to_harvest': '3-4 Years'},
        'coconut': {'fertilizer': 'NPK 500:320:1200 g/palm/year', 'days_to_harvest': '4-6 Years'},
        'papaya': {'fertilizer': 'NPK 200:200:250 g/plant/year', 'days_to_harvest': '9-11 Months'},
        'orange': {'fertilizer': 'NPK 600:300:600 g/tree', 'days_to_harvest': '3-4 Years'},
        'pomegranate': {'fertilizer': 'NPK 600:250:250 g/tree', 'days_to_harvest': '2-3 Years'},
    }
    
    crop_lower = primary_crop.lower()
    return metadata.get(crop_lower, {'fertilizer': 'NPK 20:20:20 - standard balanced mix', 'days_to_harvest': 90})
