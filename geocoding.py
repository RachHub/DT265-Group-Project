import gmaps

gmaps.configure(api_key='AIzaSyAB8gz4YNb2nnqxxaZbxylKyDG7A-oUJeQ')
# market_locations = [
# (53.3450019, -6.2658985,99),
# (53.3884218, -6.0723594,79)
# ]

# fig = gmaps.figure()
# markers = gmaps.marker_layer(market_locations)
# fig.add_layer(markers)
# print(fig)

Howth_market = (53.3884218, -6.0723594,79)
DIT = (53.3371444,-6.2687838,167)

#Create the map
fig = gmaps.figure()

#create the layer
layer = gmaps.directions.Directions(Howth_market, DIT,mode='car')

#Add the layer
fig.add_layer(layer)

print(fig)