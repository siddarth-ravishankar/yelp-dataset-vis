import time
from django.shortcuts import render_to_response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from models import *

from util.query_dataset import *
from util.response_formatter import render_response_array_from_clustered_businesses
from util.util import get_location_values_from_request_parameters

# Create your views here.

def home(request):
	return render_to_response('home.html')
	
def get_businesses(request):

	print "___________________________________________________________________________________________________"
	print "Processing response for get_business...."
	response_start_time = time.time()
	
	location_dictionary = get_location_values_from_request_parameters(request.GET)
	
	businesses_in_category = request.GET['business-categories'].replace("_amp_", "&").split(",")
	
	rating_range_string = request.GET['rating-range']
	price_range_string = request.GET['price-range']
	should_include_non_priced_businesses = True
	if (request.GET['include-non-priced-businesses'] == "false"):
		should_include_non_priced_businesses = False
	
	clustered_businesses = get_clustered_businesses_within_location(businesses, location_dictionary, number_of_cluster_rows, number_of_cluster_columns, businesses_in_category, rating_range_string, price_range_string, should_include_non_priced_businesses)
	response_array = render_response_array_from_clustered_businesses (clustered_businesses, businesses_in_category)
	response_object = {'response_object':response_array}
	
	print "Response processed in %f seconds" % (time.time() - response_start_time)	
	print "___________________________________________________________________________________________________"
	
	return JsonResponse(response_object)
	
def get_reviews(request):

	print "___________________________________________________________________________________________________"
	print "Processing response for get_reviews...."
	response_start_time = time.time()
	
	business_id = request.GET['business_id']
	
	if business_id not in reviews:
		response_object = {'response_object':[]}
	else:
		response_object = {'response_object':reviews[business_id]}
		
	print "Response processed in %f seconds" % (time.time() - response_start_time)	
	print "___________________________________________________________________________________________________"
	
	return JsonResponse(response_object)

@csrf_exempt	
def compare_businesses(request):

	print "___________________________________________________________________________________________________"
	print "Processing response for compare businesses...."
	response_start_time = time.time()
	
	businesses_id_array = request.POST['businesses_array'].split(",")
	
	businesses_array = []
	reviews_array = []
	
	attributes_comparison_table = []	
	attributes_list_dictionary = {}

	for business in businesses:
		if business['business_id'] in businesses_id_array:
			businesses_array.append(business)
# 			reviews_array.append(reviews[business['business_id']])

			for attribute in business['attributes']:
				if attribute not in attributes_list_dictionary:
					attributes_list_dictionary[attribute] = []
				attributes_list_dictionary[attribute].append(type(business['attributes'][attribute]))
		
	for attribute in attributes_list_dictionary:
		attributes_list_dictionary[attribute] = list(set(attributes_list_dictionary[attribute]))
	
	for attribute in attributes_list_dictionary:
		attribute_row = []
		attribute_row.append(attribute)
		for business in businesses_array:
			attribute_value = ""
			if attribute in business['attributes']:
				if len(attributes_list_dictionary[attribute]) == 1:
					if attributes_list_dictionary[attribute][0] is not dict:
						attribute_value = str(business['attributes'][attribute])						
					else:
						current_category = business['attributes'][attribute]
						for sub_category in current_category:
							if type(current_category[sub_category]) is not dict:
								if str(current_category[sub_category]).lower() != "no" and str(current_category[sub_category]).lower() != "false":									
									attribute_value += sub_category + ", "
						attribute_value = attribute_value[:len(attribute_value)-2]
				else:
					attribute_value = "true"					
			attribute_row.append(attribute_value.replace("_", " ").title())
		attributes_comparison_table.append(attribute_row)
			
	print "Response processed in %f seconds" % (time.time() - response_start_time)	
	print "___________________________________________________________________________________________________"

	return render_to_response('compare_businesses.html', {"businesses_array": businesses_array, "reviews_array": reviews_array, "attributes_comparison_table": attributes_comparison_table})