from business.models import master_category_keywords, category_cluster_group

def get_business_index_for_longitude (businesses, longitude):
		
	"""
	
	Function does a binary search on businesses to get the left most business greater than or equal to longitude
	Input:	businesses (list of all businesses ), longitude
	Output:	index of the left most business greater than or equal to longitude
	
	"""

	first, last = 0, len(businesses)-1	
	while first <= last:
		mid = first + (last - first) / 2
		if last == 0:
			return last
		elif first == len(businesses)-1:
			return first
		elif businesses[mid-1]['longitude'] < longitude <= businesses[mid]['longitude']:
			return mid
		elif businesses[mid]['longitude'] < longitude:
			first = mid
		else:
			last = mid
			
def get_location_values_from_request_parameters (request_parameters):
			
	"""
	
	Function creates a floating point dictionary of bounds of the 4 directions obtained in request parameter
	Input:	request_parameters ( bounds in string )
	Output:	location_dictionary ( bounds in float )
	
	"""
	
	location_dictionary = {}
	
	location_dictionary['north'] = float(request_parameters['north'])
	location_dictionary['east'] = float(request_parameters['east'])
	location_dictionary['south'] = float(request_parameters['south'])
	location_dictionary['west'] = float(request_parameters['west'])
	
	return location_dictionary
	
	
def get_master_category_for_categories (categories, businesses_in_category):
			
	"""
	
	Function predicts to which major category this business belong
	Input:	categories ( categories of business whose major category needs to be predicted )
	Output:	master_category
	
	"""
	
	if len(businesses_in_category) == 1:
		return businesses_in_category[0]
	
	master_categories_count = {}
	
	for master_category in master_category_keywords:
		master_categories_count[master_category] = 0
		
	for category in categories:
		if category_cluster_group[category] in businesses_in_category or len(businesses_in_category) == len(master_category_keywords)-1:
			master_categories_count[category_cluster_group[category]] += 1
		
# 	print "%s -> %s" %(categories, max(master_categories_count.iteritems(), key = lambda (k, v): (v))[0])
# 	raw_input()
	
	return max(master_categories_count.iteritems(), key = lambda (k, v): (v))[0]