# Cloudinary Image/PDF Fetching & Display in Flutter App
## Step-by-Step Implementation Guide

## **OVERVIEW**
When your backend API sends Cloudinary image/PDF links to the Flutter app, the app needs to:
1. Receive the URL from API response
2. Display it in the UI using Flutter widgets
3. Handle loading & error states

---

## **PART 1: SETUP DEPENDENCIES**

### Step 1: Open `pubspec.yaml` file in Flutter project

### Step 2: Add these packages under `dependencies:` section

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  cached_network_image: ^3.3.0
  path_provider: ^2.1.0
  printing: ^5.11.0
```

### Step 3: Run in terminal
```bash
flutter pub get
```

---

## **PART 2: DISPLAYING CLOUDINARY IMAGES**

### **Simple Method (No Caching)**

Use this when you just need to show an image from Cloudinary URL.

```dart
Image.network(
  'https://res.cloudinary.com/your-cloud-name/image/upload/v123456/image.jpg',
  fit: BoxFit.cover,
  loadingBuilder: (context, child, loadingProgress) {
    if (loadingProgress == null) return child;
    return Center(
      child: CircularProgressIndicator(),
    );
  },
  errorBuilder: (context, error, stackTrace) {
    return Container(
      color: Colors.grey[300],
      child: Icon(Icons.error),
    );
  },
)
```

### **Better Method (With Caching)**

Use this for images that will be shown multiple times (faster loading on repeat views).

```dart
CachedNetworkImage(
  imageUrl: 'https://res.cloudinary.com/your-cloud-name/image/upload/v123456/image.jpg',
  fit: BoxFit.cover,
  placeholder: (context, url) => Shimmer.fromColors(
    baseColor: Colors.grey[300]!,
    highlightColor: Colors.grey[100]!,
    child: Container(color: Colors.white),
  ),
  errorWidget: (context, url, error) => Icon(Icons.error),
)
```

---

## **PART 3: DISPLAYING PDFs FROM CLOUDINARY**

### **Method 1: View PDF in App**

```dart
import 'package:printing/printing.dart';
import 'package:http/http.dart' as http;

class PdfViewerScreen extends StatelessWidget {
  final String pdfUrl;

  const PdfViewerScreen({required this.pdfUrl});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('PDF Viewer')),
      body: PdfPreview(
        build: (format) => _fetchPdfBytes(),
      ),
    );
  }

  Future<Uint8List> _fetchPdfBytes() async {
    try {
      final response = await http.get(Uri.parse(pdfUrl));
      if (response.statusCode == 200) {
        return response.bodyBytes;
      } else {
        throw Exception('Failed to load PDF');
      }
    } catch (e) {
      print('Error fetching PDF: $e');
      rethrow;
    }
  }
}
```

### **Method 2: Download & Open PDF**

```dart
import 'package:path_provider/path_provider.dart';
import 'open_file/open_file.dart';

Future<void> downloadAndOpenPdf(String pdfUrl, String fileName) async {
  try {
    final response = await http.get(Uri.parse(pdfUrl));
    final dir = await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/$fileName');
    
    await file.writeAsBytes(response.bodyBytes);
    
    // Open the PDF
    await OpenFile.open(file.path);
  } catch (e) {
    print('Error downloading PDF: $e');
  }
}

// Call it like:
// downloadAndOpenPdf(cloudinaryPdfUrl, 'prescription.pdf');
```

---

## **PART 4: GETTING URL FROM YOUR API**

### **Example API Response Structure**

Your backend sends response like:
```json
{
  "success": true,
  "data": {
    "userId": "123",
    "name": "John Doe",
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123/profile.jpg",
    "prescriptionPdfUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123/prescription.pdf"
  }
}
```

### **Extract URL in Flutter**

```dart
class ApiService {
  Future<UserData> getUserData(String userId) async {
    final response = await http.get(
      Uri.parse('https://your-api.com/api/users/$userId'),
    );

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      return UserData(
        id: json['data']['userId'],
        name: json['data']['name'],
        imageUrl: json['data']['imageUrl'],  // Cloudinary URL
        prescriptionUrl: json['data']['prescriptionPdfUrl'],  // Cloudinary URL
      );
    } else {
      throw Exception('Failed to load user');
    }
  }
}

class UserData {
  final String id;
  final String name;
  final String imageUrl;
  final String prescriptionUrl;

  UserData({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.prescriptionUrl,
  });
}
```

---

## **PART 5: COMPLETE EXAMPLE SCREEN**

```dart
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:printing/printing.dart';
import 'package:http/http.dart' as http;

class UserProfileScreen extends StatefulWidget {
  final String userId;

  const UserProfileScreen({required this.userId});

  @override
  State<UserProfileScreen> createState() => _UserProfileScreenState();
}

class _UserProfileScreenState extends State<UserProfileScreen> {
  late Future<UserData> _userData;

  @override
  void initState() {
    super.initState();
    _userData = ApiService().getUserData(widget.userId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('User Profile')),
      body: FutureBuilder<UserData>(
        future: _userData,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final user = snapshot.data!;

          return ListView(
            padding: EdgeInsets.all(16),
            children: [
              // Display Profile Image from Cloudinary
              CachedNetworkImage(
                imageUrl: user.imageUrl,
                height: 200,
                fit: BoxFit.cover,
                placeholder: (context, url) => CircularProgressIndicator(),
                errorWidget: (context, url, error) => Icon(Icons.error),
              ),
              SizedBox(height: 16),
              Text('Name: ${user.name}', style: TextStyle(fontSize: 18)),
              SizedBox(height: 16),
              
              // Button to View Prescription PDF
              ElevatedButton.icon(
                onPressed: () => _viewPdf(user.prescriptionUrl),
                icon: Icon(Icons.picture_as_pdf),
                label: Text('View Prescription'),
              ),
            ],
          );
        },
      ),
    );
  }

  void _viewPdf(String pdfUrl) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PdfViewerScreen(pdfUrl: pdfUrl),
      ),
    );
  }
}
```

---

## **PART 6: TROUBLESHOOTING**

| Problem | Solution |
|---------|----------|
| Image shows as blank | Check URL is accessible, use `fit: BoxFit.cover` |
| Takes too long to load | Use `cached_network_image` for caching |
| PDF won't open | Check URL ends with `.pdf`, use `http` package to fetch first |
| CORS error | Cloudinary handles this automatically, no extra headers needed |
| Image not displaying | Check Cloudinary URL format: `https://res.cloudinary.com/...` |

---

## **PART 7: KEY POINTS TO REMEMBER**

✅ **DO:**
- Use `Image.network()` for simple images
- Use `CachedNetworkImage` when showing same image multiple times
- Add loading & error widgets for better UX
- Use `http` package to fetch PDF bytes before displaying

❌ **DON'T:**
- Don't pass URLs as hardcoded strings
- Don't forget to handle errors and loading states
- Don't use images without `.fit` property (may cause layout issues)

---

## **TESTING CHECKLIST**

- [ ] Images load successfully from Cloudinary URLs
- [ ] Loading spinner shows while image is loading
- [ ] Error icon shows if image URL is broken
- [ ] PDFs open/download successfully
- [ ] App doesn't crash if URL is null
- [ ] Images are cached after first load (if using CachedNetworkImage)

---

## **CONTACT**

If you have questions about implementation, refer to this guide or contact the backend team for URL format confirmation.
