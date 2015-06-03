import sys, os, json
from collections import Counter
import constants

# Create your models here.

def update_modified_time_for_file (file_path):
	
	"""
	
	Function updates the last modified time for the given file_path into cached_data/file_details.json meta file
	Input:	file_path - file whose last modified time needs to be updated
	Output:	True / False based on if updation to meta file is success / failure (True in this case)
	
	"""

	file_details_dictionary = {}
	file_name = file_path.split('/')[-1]
	
	if os.stat(constants.file_details_file_path).st_size > 0:
		with open(constants.file_details_file_path, 'r') as file_obj:
			file_details_dictionary = json.load(file_obj)
		file_obj.close()

	file_details_dictionary[file_name] = os.stat(file_path).st_mtime

	with open(constants.file_details_file_path, 'w') as file_obj:
		json.dump(file_details_dictionary, file_obj)
	file_obj.close()
	
	return True
	

def is_file_not_modified_since_last_usage (file_path):
	
	"""
	
	Function checks if the given file_path file has been modified since last usage as updated in cached_data/file_details.json meta file
	Input:	file path of the file which needs to be validated for last modified
	Output:	True / False if file has been modified / not modified since last usage
	
	"""

	file_name = file_path.split('/')[-1]
	
	file_details_dictionary = {}
	
	if os.stat(constants.file_details_file_path).st_size > 0:
		with open(constants.file_details_file_path, 'r') as file_obj:
			file_details_dictionary = json.load(file_obj)
		file_obj.close()
	
	return file_name in file_details_dictionary and os.stat(file_path).st_mtime == file_details_dictionary[file_name] and os.stat(file_path).st_size > 0
	
def get_cluster_categories_dictionary_from_cached_data():

	"""
	
	Function reads category cluster dictionary data from cached file
	Input:	None
	Output:	Clustered categories dictionary as read from cached_categories_cluster.json file
	
	"""

	cluster_details_dictionary = {}
	
	with open(constants.cached_categories_cluster_file_path, 'r') as file_obj:
			cluster_details_dictionary = json.load(file_obj)
	file_obj.close()
	
	return cluster_details_dictionary
	

def get_all_clustered_categories_for_master_categories(businesses, master_category_keywords):

	"""
	
	Function returns categories clustered under their master_category, either from cached file or by running the clustering algorithm
	Input:	businesses - list of all businesses, master_category_keywords - master categories under which all categories needs to be clustered
	Output:	Clustered categories dictionary
	
	"""
	
	if is_file_not_modified_since_last_usage (constants.cached_categories_cluster_file_path) and is_file_not_modified_since_last_usage (constants.business_dataset_path):
		print "Getting categories cluster from cached data"
		return get_cluster_categories_dictionary_from_cached_data()
		
	else:
		if not is_file_not_modified_since_last_usage (constants.cached_categories_cluster_file_path):
			print "%s is modified since last use" %(constants.cached_categories_cluster_file_path)
		if not is_file_not_modified_since_last_usage (constants.business_dataset_path):
			print "%s is modified since last use" %(constants.business_dataset_path)			
			
		update_modified_time_for_file (constants.business_dataset_path)
		cluster_details_dictionary = cluster_categories_into_master_categories(businesses, master_category_keywords)
		
		with open(constants.cached_categories_cluster_file_path, 'w') as file_obj:
			json.dump(cluster_details_dictionary, file_obj)
		file_obj.close()
		print "Categories cluster cached in %s" %(constants.cached_categories_cluster_file_path)			
		update_modified_time_for_file (constants.cached_categories_cluster_file_path)
		return cluster_details_dictionary
	
	

def get_all_categories_in_sorted_order (businesses):

	"""
	
	Function returns all categories present across all businesses in sorted order of the occurances
	Input:	businesses (all businesses read from JSON file)
	Output:	List of all categories in sorted order
	
	"""
	
	tags = []
	for business in businesses:
		for category in business['categories']:
			tags.append(category)
	
	tags_occurances = Counter(tags)	
	tags_occurances_list = sorted(tags_occurances.iteritems(), key = lambda (k, v): (v, k), reverse = True)
	tags = []	
	for row in tags_occurances_list:
		tags.append(row[0])
	
	return tags


def cluster_categories_into_master_categories (businesses, master_category_keywords):

	"""
	
	Function clusters all categories into master_categories_keywords and puts others in unknown category
	Input:	businesses (all businesses read from JSON file), master_category_keywords (list of master categories)
	Output:	Cluster dictionary of all categories as keys and their master_category as value
	
	"""

	categories = get_all_categories_in_sorted_order(businesses)
		
	# Process each category and find the category that occurs the most with each category (main_category)
	
	master_category, main_categories = {}, []
	number_of_categories_processed = 0
	
	for current_category in categories:

		if current_category in master_category_keywords:
			master_category[current_category] = current_category
		else:
			cluster_value_for_current_category = {}		

			for business in businesses:
				if current_category in business['categories']:
					for each_category in business['categories']:
						if each_category in cluster_value_for_current_category and each_category != current_category:
							cluster_value_for_current_category[each_category] = cluster_value_for_current_category[each_category] + 1
						elif each_category != current_category:
							cluster_value_for_current_category[each_category] = 1		

			master_category[current_category] = max(cluster_value_for_current_category.iteritems(), key = lambda (k, v): (v))[0]
			main_categories.append(master_category[current_category])
		
		number_of_categories_processed += 1
		sys.stdout.write("Processed: %d categories\r" % (number_of_categories_processed) )
		sys.stdout.flush()
	
	main_categories = set(main_categories)
	
	# Do refinement on the clustered categories - sub cluster categories again until only master_category_keywords remain

	replacement_done = True
	
	print "\nRefining category clusters\n"
	
	while replacement_done:
		replacement_done = False
		for current_category in main_categories:
			my_master_category = master_category[current_category]
			if current_category not in master_category_keywords and my_master_category in master_category_keywords:
				for each_category in master_category:
					if master_category[each_category] == current_category:
						master_category[each_category] = my_master_category
						replacement_done = True		
	for category in master_category:
		if master_category[category] not in master_category_keywords:
			master_category[category] = 'Unknown'
			
	return master_category