import base64
import copy
from json import dumps, loads

import cv2
import matplotlib.pyplot as plt
import numpy as np

from flask import Flask, request
from flask_cors import CORS