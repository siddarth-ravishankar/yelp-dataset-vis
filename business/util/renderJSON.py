import os, json
import constants

def get_businesses():
	
	"""
	
	Function reads businesses json file and returns list of businesses
	Input:	None
	Output:	List of businesses dictionary
	
	"""
	
	businesses_array = []	
	with open(constants.business_dataset_path, 'r') as fileObj:
		for fileLine in fileObj:
			businesses_array.append(json.loads(fileLine))	
	return businesses_array
	
def get_reviews():
	
	"""
	
	Function reads reviews json file and returns list of reviews
	Input:	None
	Output:	List of reviews dictionary indexed on reviews_id
	Note: This function is deprecated as of now
	
	"""
	
	reviews_array = []
	with open(constants.review_dataset_path, 'r') as fileObj:
		for fileLine in fileObj:
			reviews_array.append(json.loads(fileLine))	
	return reviews_array
	

def get_reviews_index_on_business_id():
	
	"""
	
	Function reads reviews json file and returns dictionary of reviews
	Input:	None
	Output:	Dictionary of reviews indexed on business_id
	
	"""
	
	reviews_dictionary = {}
	with open(constants.review_dataset_path, 'r') as fileObj:
	
		for fileLine in fileObj:
			review_object = json.loads(fileLine)
			current_business_id = review_object['business_id']
			del(review_object['business_id'])
			
			if current_business_id not in reviews_dictionary:
				reviews_dictionary[current_business_id] = []
			
			reviews_dictionary[current_business_id].append(review_object)
			
	return reviews_dictionary

	
def get_users():
		
	"""
	
	Function reads users json file and returns list of users dictionary
	Input:	None
	Output:	List of users dictionary
	Note: Users details are not used in this project. This function may be referenced for future use.
	
	"""
	
	users_array = []	
	with open(constants.user_dataset_path, 'r') as fileObj:
		for fileLine in fileObj:
			users_array.append(json.loads(fileLine))	
	return users_array