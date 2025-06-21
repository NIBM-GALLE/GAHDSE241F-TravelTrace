import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class MapLocationPicker extends StatefulWidget {
  final LatLng? initialLocation;
  
  const MapLocationPicker({
    Key? key,
    this.initialLocation,
  }) : super(key: key);

  @override
  State<MapLocationPicker> createState() => _MapLocationPickerState();
}

class _MapLocationPickerState extends State<MapLocationPicker> {
  LatLng? _selectedLocation;
  GoogleMapController? _mapController;
  BitmapDescriptor? _markerIcon;

  static const _initialCameraPosition = CameraPosition(
    target: LatLng(6.9271, 79.8612), // Default to Sri Lanka
    zoom: 13,
  );

  @override
  void initState() {
    super.initState();
    _selectedLocation = widget.initialLocation;
    _createMarkerIcon();
  }

  Future<void> _createMarkerIcon() async {
    _markerIcon = await BitmapDescriptor.defaultMarkerWithHue(
      BitmapDescriptor.hueAzure,
    );
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Location'),
        actions: [
          if (_selectedLocation != null)
            TextButton.icon(
              onPressed: () {
                Navigator.pop(context, _selectedLocation);
              },
              icon: const Icon(Icons.check, color: Colors.white),
              label: const Text(
                'Confirm Location',
                style: TextStyle(color: Colors.white),
              ),
            ),
        ],
      ),
      body: Stack(
        children: [
          GoogleMap(
            initialCameraPosition: widget.initialLocation != null
                ? CameraPosition(
                    target: widget.initialLocation!,
                    zoom: 15,
                  )
                : _initialCameraPosition,
            onMapCreated: (controller) {
              _mapController = controller;
            },
            markers: _selectedLocation != null && _markerIcon != null
                ? {
                    Marker(
                      markerId: const MarkerId('selected_location'),
                      position: _selectedLocation!,
                      icon: _markerIcon!,
                      infoWindow: const InfoWindow(
                        title: 'Selected Location',
                      ),
                    ),
                  }
                : {},
            onTap: (LatLng position) {
              setState(() {
                _selectedLocation = position;
              });
            },
          ),
          if (_selectedLocation != null)
            Positioned(
              bottom: 16,
              left: 16,
              right: 16,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        'Selected Location:',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Latitude: ${_selectedLocation!.latitude.toStringAsFixed(6)}',
                        style: const TextStyle(fontSize: 14),
                      ),
                      Text(
                        'Longitude: ${_selectedLocation!.longitude.toStringAsFixed(6)}',
                        style: const TextStyle(fontSize: 14),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _mapController?.dispose();
    super.dispose();
  }
} 