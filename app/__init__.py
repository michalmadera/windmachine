from flask import Flask
from flask import render_template
from flask_caching import Cache
import boating
import threading
import boating 
import time

app = Flask(__name__)

cache = Cache(config={'DEBUG': True, 
                      'CACHE_TYPE': 'simple',
                      'CACHE_DEFAULT_TIMEOUT': 0,})
cache.init_app(app)

class Counter():
    index = 0

def getmyboat():
    myboat = cache.get(Counter.index)
    if myboat is None:
        print('boat index not cached:', Counter.index)
        Counter.index = Counter.index + 1
        myboat = boating.Boat(Counter.index, 100, 10, 10)
        cache.set(Counter.index, myboat)
    else:
        print('Fetched from cache boat:', myboat.identity)
    return myboat

@app.route('/')
@app.route('/index')
def index():
    user = {'username': 'Michal'}
    posts = [
        {
            'author': {'username': 'John'},
            'body': 'Beautiful day in Portland!'
        },
        {
            'author': {'username': 'Susan'},
            'body': 'The Avengers movie was so cool!'
        }
    ]
    return render_template('index.html', title='Home', user=user, posts=posts)


@app.route('/boatstate')
def boatstate():
    myboat = getmyboat()
    boatstate = myboat.getstate();
    return render_template('boatstate.html', title='Boat', boatstate=boatstate)


@app.route('/startboat')
def startboat():
    myboat = getmyboat()
    t = threading.Thread(target=boating.run_boat_state_logic, args=(myboat.identity, cache))
    t.start()
    t = threading.Thread(target=boating.run_boat_state_visualisation, args=(myboat.identity, cache))
    t.start()
    boatstate = myboat.getstate();
    return render_template('boatstate.html', title='Boat', boatstate=boatstate)
