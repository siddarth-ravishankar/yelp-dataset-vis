import os, json
import constants

def get_businesses():
	businesses_array = []	
	with open(constants.business_dataset_path, 'r') as fileObj:
		for fileLine in fileObj:
			businesses_array.append(json.loads(fileLine))	
	return businesses_array
	
def get_reviews():
	reviews_array = []
	with open(constants.review_dataset_path, 'r') as fileObj:
		for fileLine in fileObj:
			reviews_array.append(json.loads(fileLine))	
	return reviews_array
	
def get_reviews_index_on_business_id():

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
	users_array = []	
	with open(constants.user_dataset_path, 'r') as fileObj:
		for fileLine in fileObj:
			users_array.append(json.loads(fileLine))	
	return users_array