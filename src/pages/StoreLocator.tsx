import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Navigation, Search } from "lucide-react";

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  services: string[];
  distance?: number;
}

const mockStores: Store[] = [
  {
    id: '1',
    name: 'JumpStart Fashion - Downtown',
    address: '123 Fashion Ave',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '(212) 555-0123',
    hours: 'Mon-Sat: 10AM-9PM, Sun: 11AM-7PM',
    services: ['Personal Styling', 'Alterations', 'VIP Shopping'],
    distance: 0.8
  },
  {
    id: '2',
    name: 'JumpStart Fashion - SoHo',
    address: '456 Broadway',
    city: 'New York',
    state: 'NY',
    zip: '10012',
    phone: '(212) 555-0456',
    hours: 'Mon-Sat: 10AM-10PM, Sun: 11AM-8PM',
    services: ['Personal Styling', 'Express Pickup', 'Same-day Delivery'],
    distance: 1.2
  },
  {
    id: '3',
    name: 'JumpStart Fashion - Upper East Side',
    address: '789 Madison Ave',
    city: 'New York',
    state: 'NY',
    zip: '10075',
    phone: '(212) 555-0789',
    hours: 'Mon-Sat: 10AM-8PM, Sun: 12PM-6PM',
    services: ['Personal Styling', 'VIP Shopping', 'Private Appointments'],
    distance: 2.1
  },
  {
    id: '4',
    name: 'JumpStart Fashion - Brooklyn Heights',
    address: '321 Court St',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11201',
    phone: '(718) 555-0321',
    hours: 'Mon-Sat: 10AM-9PM, Sun: 11AM-7PM',
    services: ['Personal Styling', 'Alterations', 'Express Pickup'],
    distance: 3.5
  },
  {
    id: '5',
    name: 'JumpStart Fashion - Westchester',
    address: '555 Central Ave',
    city: 'White Plains',
    state: 'NY',
    zip: '10606',
    phone: '(914) 555-0555',
    hours: 'Mon-Sat: 10AM-9PM, Sun: 11AM-7PM',
    services: ['Personal Styling', 'Alterations', 'Same-day Delivery'],
    distance: 25.7
  }
];

const StoreLocator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState<Store[]>(mockStores);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredStores(mockStores);
      return;
    }

    const filtered = mockStores.filter(store => 
      store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.zip.includes(searchQuery)
    );
    setFilteredStores(filtered);
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-luxury mb-6">
            Find a JumpStart Store
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Visit any of our 750+ locations nationwide for personalized styling, 
            expert advice, and exclusive in-store experiences.
          </p>
          
          {/* Search */}
          <div className="flex max-w-md mx-auto gap-2">
            <Input
              placeholder="Enter city, state, or ZIP code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="btn-luxury">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Store Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Store List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              {filteredStores.length} Store{filteredStores.length !== 1 ? 's' : ''} Found
            </h2>
            
            {filteredStores.map((store) => (
              <Card key={store.id} className="card-fashion">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-2">
                        <MapPin className="h-4 w-4" />
                        {store.address}, {store.city}, {store.state} {store.zip}
                      </CardDescription>
                    </div>
                    {store.distance && (
                      <Badge variant="outline">
                        {store.distance} mi
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {store.phone}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {store.hours}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Services Available:</p>
                    <div className="flex flex-wrap gap-1">
                      {store.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Store
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="lg:sticky lg:top-8">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Store Locations Map</CardTitle>
                <CardDescription>Interactive map showing nearby JumpStart stores</CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="font-medium text-gray-600">Interactive Map</p>
                      <p className="text-sm text-gray-500">
                        Map integration would show store locations,
                        <br />directions, and real-time availability
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Regional Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-600">185</CardTitle>
              <CardDescription>Northeast Stores</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-600">210</CardTitle>
              <CardDescription>Southeast Stores</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-purple-600">160</CardTitle>
              <CardDescription>Midwest Stores</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-orange-600">120</CardTitle>
              <CardDescription>Southwest Stores</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-red-600">75</CardTitle>
              <CardDescription>West Coast Stores</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
