from util import get_master_category_for_categories

def create_clustered_business_object (cluster, response_object):
	
	"""
	
	Function creates a single response object that has aggregated details of group of clusters that are closer to each other
	Input:	cluster ( list of businesses that are closer to each other )
	Output:	response_object ( pass by reference, dictionary containing aggregated data of the businesses in this cluster )
	
	"""
	
	response_object['type'] = "clustered"
	latitude, longitude, boundary = 0.0, 0.0, {}
	
	boundary['north'], boundary['south'], boundary['east'], boundary['west'] = cluster[0]['latitude'], cluster[len(cluster)-1]['latitude'], cluster[0]['longitude'], cluster[len(cluster)-1]['longitude']
		
	for business in cluster:
		latitude += business['latitude']
		longitude += business['longitude']
		boundary['north'] = max(boundary['north'], business['latitude'])		#Since clusters are sorted on longitude, only latitude boundary needs to be checked
		boundary['south'] = min(boundary['south'], business['latitude'])		
	
	response_object['latitude'] = latitude / len(cluster)
	response_object['longitude'] = longitude / len(cluster)
	response_object['count'] = len(cluster)
	response_object['boundary'] = boundary
	
	businesses_in_price_range = {1:0, 2:0, 3:0, 4:0}
	businesses_in_categories = {}
	
	businesses_in_star_rating_with_price_range = {}
	
	star_rating_array = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
	
	for star_rating in star_rating_array:
		businesses_in_star_rating_with_price_range[star_rating] = {0:0, 1:0, 2:0, 3:0, 4:0}
	
	for business in cluster:
		if 'Price Range' in business['attributes']:
			businesses_in_star_rating_with_price_range[business['stars']][business['attributes']['Price Range']] += 1
		else:
			businesses_in_star_rating_with_price_range[business['stars']][0] += 1

		for category in business['categories']:
			if category not in businesses_in_categories:
				businesses_in_categories[category] = 0
			businesses_in_categories[category] += 1
			
	response_object['businesses_in_categories'] = businesses_in_categories
	response_object['rating_with_price_range_info'] = businesses_in_star_rating_with_price_range
			
def create_individual_business_object (cluster, response_object, businesses_in_category):
	
	"""
	
	Function creates a single response object that are individual businesses in this cluster
	Input:	cluster ( list of businesses )
	Output:	response_object ( pass by reference, dictionary containing list of businesses in cluster with metadata )
	
	"""
	
	response_object['type'] = "individual"
	response_object['businesses'] = cluster
	for business in cluster:
		business['master_category'] = get_master_category_for_categories(business['categories'], businesses_in_category)

def render_response_array_from_clustered_businesses (clustered_businesses, businesses_in_category):
	
	"""
	
	Function creates a list of response objects for the given clusters. Each cluster contains either aggregated businesses information or individual businesses
	Input:	clustered_businesses ( list of clusters, each having either clustered or individual businesses )
	Output:	response_array ( list of response_objects that are either clustered or individual businesses )
	
	"""
	
	response_array = []
	
	for latitude_cluster in clustered_businesses:
		for cluster in latitude_cluster:		
			if cluster:
				response_object = {}			
				if len(cluster) > 5:
					create_clustered_business_object(cluster, response_object)
				else:
					create_individual_business_object(cluster, response_object, businesses_in_category)
				response_array.append(response_object)				

	return response_array