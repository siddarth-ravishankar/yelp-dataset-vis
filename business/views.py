import time
from django.shortcuts import render_to_response
from django.http import JsonResponse

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
	
	clustered_businesses = get_clustered_businesses_within_location(businesses, location_dictionary, number_of_cluster_rows, number_of_cluster_columns, businesses_in_category)
	response_array = render_response_array_from_clustered_businesses (clustered_businesses, businesses_in_category)
	response_object = {'response_object':response_array}
	
# 	for response in response_array:
# 		print response

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
		
# 	for review in response_object['response_object']:
# 		print review

	print "Response processed in %f seconds" % (time.time() - response_start_time)	
	print "___________________________________________________________________________________________________"
	
	return JsonResponse(response_object)
	
