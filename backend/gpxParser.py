if False:
    # Does "pip install" for non-builtin modules.
    # If the code complains about modules not existing,
    # set this to "if True" once
    # so it can import the modules.
    import ensurepip

    ensurepip.bootstrap(upgrade=True)
    ensurepip._run_pip(["install", "xmltodict"])
    ensurepip._run_pip(["install", "great-circle-calculator"])
    ensurepip._run_pip(["install", "geojson"])

import pprint # used only for testing code
import xmltodict
import great_circle_calculator.great_circle_calculator as gcc
import geojson

def gpx_to_json(filepath: str) -> dict:
    """Convert gpx files to a custom json format.

    The outermost level is a dict with {info, segments}.
    "info" is itself a dict with relevant file info, i.e.:
           {creator, version, xmlns, xmlns:xsi,
            link, link text, time, track name}
    "segments" is a list of segments,
               each of which is a list of points,
               each of which is a dictionary of:
               {lon, lat, ele, horz_dist_from_prev, bearing_from_prev}
    """

    with open(filepath) as gpx:
        gpx_dict = xmltodict.parse(gpx.read())['gpx']

    info = {'creator': gpx_dict['@creator'],
            'version': gpx_dict['@version'],
            'xmlns': gpx_dict['@xmlns'],
            'xmlns:xsi': gpx_dict['@xmlns:xsi'],
            'link': gpx_dict['metadata']['link']['@href'],
            'link text': gpx_dict['metadata']['link']['text'],
            'time': gpx_dict['metadata']['time'],
            'track name': gpx_dict['trk']['name']
            }
    
    segmentNumber = 1
    # create json list of segments (the format of this list is detailed in the docstring)
    for key in gpx_dict['trk']:
        if key == 'trkseg':
            trkpt_list = gpx_dict['trk'][key]['trkpt']

            # this bit has three purposes:
            # (a) rename '@lat' and '@lon' to 'lat' and 'lon'
            #     because that makes more sense
            # (b) add 'horz_dist_from_prev' and 'bearing_from_prev'
            # (c) throw out 'time' because we don't need it

            prev_lat = None
            prev_lon = None

            cumulative_distance = 0
            final = 0
            new_trkpt_list = []
            segments = []

            for trkpt in trkpt_list:

                new_trkpt = {}
                
                lat = trkpt['@lat']
                lon = trkpt['@lon']
                if prev_lat is not None:
                    new_trkpt['horz_dist_from_prev'] = gcc.distance_between_points([prev_lon, prev_lat], [lon, lat])
                    cumulative_distance = float(gcc.distance_between_points([prev_lon, prev_lat], [lon, lat]))
                    new_trkpt['bearing_from_prev'] = gcc.bearing_at_p1([prev_lon, prev_lat], [lon, lat])
                else:
                    new_trkpt['horz_dist_from_prev'] = None
                    new_trkpt['bearing_from_prev'] = None
                new_trkpt['lat'] = lat
                new_trkpt['lon'] = lon
                prev_lat = lat
                prev_lon = lon

                new_trkpt['ele'] = trkpt['ele']
                new_trkpt['smooth_slope'] = '?'
                new_trkpt['segment'] = segmentNumber


                final = float(final) + cumulative_distance
                new_trkpt['distance'] = final

                new_trkpt_list += [new_trkpt]
            segments += new_trkpt_list
            segmentNumber += 1    

    return {'info': info, 'segments': segments}


def gpx_to_geojson(filepath: str) -> geojson.MultiLineString:
    """Convert gpx files to the geojson format.

    The geojson geometry type is a MultiLineString
    (i.e. a list of LineStrings,
     where each LineString is a segment of the track).
    Coordinates include elevation.
    """


    with open(filepath) as gpx:
        gpx_dict = xmltodict.parse(gpx.read())['gpx']

    # group points into segments, like the following:
    # A list of segments, each of which is:
    #   A list of points, each of which is:
    #     A list of [lon, lat, ele]
    segments = []
    for key in gpx_dict['trk']:
        if key == 'trkseg':
            segment = []
            for trkpt in gpx_dict['trk'][key]['trkpt']:
                segment += [[float(trkpt['@lon']),
                             float(trkpt['@lat']),
                             float(trkpt['ele'])]]
            segments += [segment]

    return geojson.MultiLineString(segments)

if True: # testing code
    filepath = "GPX example files/Tokyo-Olympics-Men's-ITT_track.gpx"
    gpx_json = gpx_to_json(filepath)
    ##gpx_geojson = gpx_to_geojson(filepath)

    pprint.PrettyPrinter().pprint(gpx_json)
