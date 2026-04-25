import { useState } from 'react';

import { ProfileScreen } from '@/src/screens/ProfileScreen';
import { VehicleScreen } from '@/src/screens/VehicleScreen';

type Screen = 'profile' | 'vehicle';

export default function Index() {
  const [screen, setScreen] = useState<Screen>('profile');

  if (screen === 'vehicle') {
    return <VehicleScreen onBack={() => setScreen('profile')} />;
  }

  return <ProfileScreen onShowVehicle={() => setScreen('vehicle')} />;
}
