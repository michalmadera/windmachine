# -*- coding: utf-8 -*-
"""
Created on Sat Dec  5 20:38:40 2020

@author: michalm
"""

from flask import Flask
from flask_caching import Cache
import threading
import time


class Boat:

    def __init__(self, identity, heading, latitude, longitude):
        
        self.identity = identity
        self.heading = heading #boat direction - angle between meridian (north-south) and direction boat is navigating
        self.latitude = latitude 
        self.longitude = longitude
        self.speed = 0

        self.rudderangle = 0
        self.sailangle = 0

        self.thrust = 0
        print('new Boat created')
   
    def getstate(self):
        boatstate = {'identity':self.identity, 'heading':self.heading, 
                     'latitude':self.latitude, 'longitude':self.longitude,
                     'speed':self.speed}
        return boatstate

class MeteoConditions:
        
     def getWind(self, position, time):
        #for all positions and all time wind and its directions are the same
        windangle = 30
        windspeed = 5
        return (windangle, windspeed)


class BoatStateLogic:
    
    def __init__(self, boatidentity, cache):
        self.boatidentity = boatidentity
        self.cache = cache
    
    def run(self):
        for i in range(20):
            myboat = self.cache.get(self.boatidentity)
            if myboat is not None:
                self.update(myboat)
                self.cache.set(myboat.identity, myboat)
            else:
                print('boat not cached:', self.boatidentity)
            time.sleep(1)
    
    def update(self, myboat):
        myboat.speed = myboat.speed+3


class BoatStateVisualisation:
    
    def __init__(self, boatidentity, cache):
        self.boatidentity = boatidentity
        self.cache = cache
    
    def run(self):
        for i in range(10):
            myboat = self.cache.get(self.boatidentity)
            if myboat is not None:
                self.update(myboat)
            else:
                print('boat not cached:', self.boatidentity)
            time.sleep(2)
    
    def update(self, myboat):
            print('BOAT:',myboat.identity, 
                  'SPEED:', myboat.speed,
                  'SAIL:',myboat.sailangle,
                  'HEADING:', myboat.heading)


def run_boat_state_logic(boatidentity, cache):
    bsl = BoatStateLogic(boatidentity, cache)
    bsl.run()
    return

def run_boat_state_visualisation(boatidentity, cache):
    bsl = BoatStateVisualisation(boatidentity, cache)
    bsl.run()
    return

if __name__ == '__main__':
    app = Flask(__name__)
    
    cache = Cache(config={'DEBUG': True, 
                      'CACHE_TYPE': 'simple',
                      'CACHE_DEFAULT_TIMEOUT': 0,})
    
    cache.init_app(app)
    myboat = Boat(1, 100, 10, 10)
    cache.set(1, myboat)
    t = threading.Thread(target=run_boat_state_logic, args=(myboat.identity, cache))
    t.start()
    t = threading.Thread(target=run_boat_state_visualisation, args=(myboat.identity, cache))
    t.start()
    