import os
from django.conf import settings

project_path			=	settings.BASE_DIR

app_path				=	os.path.join(project_path, "business")

resources_path			=	os.path.join(app_path, "resources")

dataset_path			=	os.path.join(project_path, "../data/yelp_dataset_challenge_academic_dataset")

business_dataset_path	=	os.path.join(dataset_path, "yelp_academic_dataset_business.json")

checkin_dataset_path	=	os.path.join(dataset_path, "yelp_academic_dataset_checkin.json")

review_dataset_path		=	os.path.join(dataset_path, "yelp_academic_dataset_review.json")

tip_dataset_path		=	os.path.join(dataset_path, "yelp_academic_dataset_tip.json")

user_dataset_path		=	os.path.join(dataset_path, "yelp_academic_dataset_user.json")

# Cached data contents

cached_data_folder_path	=	os.path.join(resources_path, "cached_data")

file_details_file_path	=	os.path.join(cached_data_folder_path, "file_details.json")

cached_categories_cluster_file_path	=	os.path.join(cached_data_folder_path, "cached_categories_cluster.json")