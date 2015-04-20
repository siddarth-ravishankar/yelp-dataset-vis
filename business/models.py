from django.db import models
from util.renderJSON import *
from util.cluster_categories import get_all_clustered_categories_for_master_categories
import os
# Create your models here.

print os.getpid()

print "\n********** Initializing models **********\n"

master_category_keywords = ['Restaurants', 'Food', 'Beauty & Spas', 'Bars', 'Nightlife', 'Arts & Entertainment', 'Event Planning & Services', 'Fitness & Instruction', 'Active Life', 'Local Services', 'Professional Services', 'Public Services & Government', 'Financial Services', 'Home Services', 'Auto Repair', 'Automotive', 'Pets', 'Health & Medical', 'Shopping', 'Specialty Schools', 'Hotels & Travel', 'Religious Organizations', 'Unknown']

businesses = get_businesses()

print "\n********** Clustering categories **********\n"
category_cluster_group = get_all_clustered_categories_for_master_categories(businesses, master_category_keywords)
print "\n********** Clustered %d categories into %d categories **********\n" % (len(category_cluster_group), len(set(category_cluster_group.values())))

number_of_cluster_rows = 10
number_of_cluster_columns = 15

print "\n********** Sorting businesses based on longitude and latitude **********\n"

businesses = sorted(businesses, key=lambda businesses: (businesses['longitude'], businesses['latitude']))

print "\n********** Indexing business reviews **********\n"

reviews = get_reviews_index_on_business_id()

users = get_users()

print "\n********** Models added **********\n"