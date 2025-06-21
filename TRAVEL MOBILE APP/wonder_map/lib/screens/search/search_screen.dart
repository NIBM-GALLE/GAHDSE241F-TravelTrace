import 'package:flutter/material.dart';
import '../../services/trail_service.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _trailService = TrailService();
  final _searchController = TextEditingController();
  List<Map<String, dynamic>> _trails = [];
  bool _isLoading = true;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadTrails();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadTrails() async {
    try {
      setState(() => _isLoading = true);
      final trails = await _trailService.getAllTrails();
      setState(() {
        _trails = trails;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading trails: $e')),
      );
      setState(() => _isLoading = false);
    }
  }

  List<Map<String, dynamic>> get _filteredTrails {
    if (_searchQuery.isEmpty) return _trails;
    return _trails.where((trail) {
      final name = trail['name']?.toString().toLowerCase() ?? '';
      final category = trail['category']?.toString().toLowerCase() ?? '';
      final description = trail['short_description']?.toString().toLowerCase() ?? '';
      final query = _searchQuery.toLowerCase();
      return name.contains(query) ||
          category.contains(query) ||
          description.contains(query);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          decoration: const InputDecoration(
            hintText: 'Search trails...',
            border: InputBorder.none,
            hintStyle: TextStyle(color: Colors.white70),
          ),
          style: const TextStyle(color: Colors.white),
          onChanged: (value) => setState(() => _searchQuery = value),
        ),
        actions: [
          if (_searchQuery.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.clear),
              onPressed: () {
                _searchController.clear();
                setState(() => _searchQuery = '');
              },
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _filteredTrails.isEmpty
              ? Center(
                  child: Text(
                    _searchQuery.isEmpty
                        ? 'No trails found'
                        : 'No trails matching "$_searchQuery"',
                  ),
                )
              : ListView.builder(
                  itemCount: _filteredTrails.length,
                  padding: const EdgeInsets.all(8),
                  itemBuilder: (context, index) {
                    final trail = _filteredTrails[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (trail['photo_url'] != null)
                            Image.network(
                              trail['photo_url'],
                              height: 200,
                              width: double.infinity,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  Container(
                                height: 200,
                                color: Colors.grey[300],
                                child: const Icon(Icons.error),
                              ),
                            ),
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  trail['name'] ?? 'Unnamed Trail',
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  trail['category'] ?? 'Uncategorized',
                                  style: TextStyle(
                                    color: Theme.of(context).primaryColor,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  trail['short_description'] ??
                                      'No description available',
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                  ),
                                  maxLines: 3,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    Icon(Icons.calendar_today,
                                        size: 16, color: Colors.grey[600]),
                                    const SizedBox(width: 8),
                                    Text(
                                      trail['trail_date'] ?? 'No date',
                                      style:
                                          TextStyle(color: Colors.grey[600]),
                                    ),
                                    const SizedBox(width: 16),
                                    Icon(Icons.access_time,
                                        size: 16, color: Colors.grey[600]),
                                    const SizedBox(width: 8),
                                    Text(
                                      trail['trail_time'] ?? 'No time',
                                      style:
                                          TextStyle(color: Colors.grey[600]),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          ButtonBar(
                            children: [
                              TextButton.icon(
                                icon: const Icon(Icons.map),
                                label: const Text('View on Map'),
                                onPressed: () {
                                  // TODO: Implement map view
                                },
                              ),
                              TextButton.icon(
                                icon: const Icon(Icons.info),
                                label: const Text('Details'),
                                onPressed: () {
                                  // TODO: Navigate to trail details
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
    );
  }
} 