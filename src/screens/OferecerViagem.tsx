import { AntDesign, FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Keyboard,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// ✅ Lazy import seguro
import fatecsData from '@/src/assets/apis/fatecs.json';
import MapNative from '@/src/components/MapNative';

type Suggestion = {
    id: string;
    description: string;
    latitude: number;
    longitude: number;
};

type ViaCepResponse = {
    cep?: string;
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
    erro?: boolean;
};

type AwesomeCepResponse = {
    cep?: string;
    address?: string;
    district?: string;
    city?: string;
    state?: string;
    lat?: string;
    lng?: string;
};

type CepAddress = {
    display: string;
    query: string;
    latitude?: number;
    longitude?: number;
};

type NominatimResult = {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
};

type Fatec = {
    cidade: string;
    nome: string;
    endereco: string;
    cep: string | null;
    uf: string;
};

const formatReverseAddress = (addr: any) => {
    return [
        `${addr.street || ''}${addr.streetNumber ? ', ' + addr.streetNumber : ''}`.trim(),
        addr.district,
        addr.city,
    ]
        .filter(Boolean)
        .join(' - ');
};

const fatecs = fatecsData as Fatec[];

const normalizeText = (text: string) => {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
};

const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Marco',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const classTimeSuggestions = [
    { label: 'Aula 07:40', hour: 7, minute: 40 },
    { label: 'Aula 18:00', hour: 18, minute: 0 },
    { label: 'Aula 19:00', hour: 19, minute: 0 },
];

const formatDateBR = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const formatTypedDate = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    return [day, month, year].filter(Boolean).join('/');
};

const startOfDay = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const parseDateBR = (text: string) => {
    const [dayText, monthText, yearText] = text.split('/');

    if (!dayText || !monthText || !yearText || yearText.length !== 4) return null;

    const day = Number(dayText);
    const month = Number(monthText);
    const year = Number(yearText);
    const parsed = new Date(year, month - 1, day);

    if (
        parsed.getDate() !== day ||
        parsed.getMonth() !== month - 1 ||
        parsed.getFullYear() !== year
    ) {
        return null;
    }

    return parsed;
};

const isBeforeToday = (date: Date) => {
    return startOfDay(date).getTime() < startOfDay(new Date()).getTime();
};

const isSameDay = (date: Date, compare: Date) => {
    return startOfDay(date).getTime() === startOfDay(compare).getTime();
};

const getCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay }, () => null);
    const days = Array.from({ length: totalDays }, (_, index) => index + 1);

    return [...blanks, ...days];
};

export default function OferecerViagem() {
    const MAX_SEATS = 4;
    const dateInputRef = useRef<TextInput>(null);
    const timeInputRef = useRef<TextInput>(null);

    const [seats, setSeats] = useState(1);
    const [locationText, setLocationText] = useState('');
    const [searchText, setSearchText] = useState('');
    const [arrivalText, setArrivalText] = useState('');
    const [arrivalSuggestions, setArrivalSuggestions] = useState<Fatec[]>([]);
    const [departureDate, setDepartureDate] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [manualDateInput, setManualDateInput] = useState(false);
    const [timePickerVisible, setTimePickerVisible] = useState(false);
    const [manualTimeInput, setManualTimeInput] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [region, setRegion] = useState({
        latitude: -23.5505,
        longitude: -46.6333,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);

    const moveMapToAddress = (latitude: number, longitude: number, address: string) => {
        setRegion(prev => ({
            ...prev,
            latitude,
            longitude,
        }));
        setLocationText(address);
        setSearchText('');
        setSuggestions([]);
    };

    const getAddressByCep = async (cep: string): Promise<CepAddress | null> => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return null;

        try {
            const resp = await fetch(`https://cep.awesomeapi.com.br/json/${cleanCep}`);

            if (resp.ok) {
                const data: AwesomeCepResponse = await resp.json();
                const latitude = Number(data.lat);
                const longitude = Number(data.lng);
                const cityState = [data.city, data.state].filter(Boolean).join(' - ');
                const display = [
                    data.address,
                    data.district,
                    cityState,
                    data.cep ? `CEP ${data.cep}` : '',
                ]
                    .filter(Boolean)
                    .join(', ');

                const query = [
                    data.address,
                    data.district,
                    data.city,
                    data.state,
                    'Brasil',
                ]
                    .filter(Boolean)
                    .join(', ');

                if (display || query) {
                    return {
                        display: display || query,
                        query: query || display,
                        latitude: Number.isFinite(latitude) ? latitude : undefined,
                        longitude: Number.isFinite(longitude) ? longitude : undefined,
                    };
                }
            }
        } catch {
            console.warn('Erro ao consultar CEP com coordenadas');
        }

        const resp = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data: ViaCepResponse = await resp.json();

        if (data.erro) return null;

        const cityState = [data.localidade, data.uf].filter(Boolean).join(' - ');
        const display = [
            data.logradouro,
            data.bairro,
            cityState,
            data.cep ? `CEP ${data.cep}` : '',
        ]
            .filter(Boolean)
            .join(', ');

        const query = [
            data.logradouro,
            data.bairro,
            data.localidade,
            data.uf,
            data.cep,
            'Brasil',
        ]
            .filter(Boolean)
            .join(', ');

        return {
            display: display || cep,
            query: query || cep,
        };
    };

    const searchAddressResults = async (address: string) => {
        const resp = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=br&q=${encodeURIComponent(address)}`,
            {
                headers: {
                    'Accept-Language': 'pt-BR',
                },
            }
        );

        if (!resp.ok) return [];

        const data: NominatimResult[] = await resp.json();

        return data
            .map((item) => ({
                id: String(item.place_id),
                description: item.display_name,
                latitude: Number(item.lat),
                longitude: Number(item.lon),
            }))
            .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));
    };

    const geocodeAddress = async (address: string, displayAddress?: string) => {
        const results = await searchAddressResults(address);
        const result = results[0];

        if (!result) return false;

        moveMapToAddress(
            result.latitude,
            result.longitude,
            displayAddress || result.description || address
        );

        return true;
    };

    const searchTypedAddress = async (text = searchText) => {
        const searchText = text.trim();

        if (searchText.length < 3) {
            setSuggestions([]);
            return false;
        }

        try {
            setLoading(true);
            const cleanCep = searchText.replace(/\D/g, '');

            if (cleanCep.length === 8) {
                const cepAddress = await getAddressByCep(cleanCep);
                if (cepAddress) {
                    if (
                        cepAddress.latitude !== undefined &&
                        cepAddress.longitude !== undefined
                    ) {
                        moveMapToAddress(
                            cepAddress.latitude,
                            cepAddress.longitude,
                            cepAddress.display
                        );
                        return true;
                    }

                    const foundByCep = await geocodeAddress(cepAddress.query, cepAddress.display);
                    if (foundByCep) return true;
                }
            }

            return await geocodeAddress(searchText);
        } catch (err) {
            console.warn('Erro ao pesquisar endereco', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSearchTextChange = (text: string) => {
        setSearchText(text);

        const cleanCep = text.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            setSuggestions([]);
            searchTypedAddress(text);
            return;
        }

        fetchSuggestions(text);
    };

    const handleSearchFocus = () => {
        setSearchText('');
        setSuggestions([]);
    };

    const confirmLocation = async () => {
        if (searchText.trim().length >= 3) {
            await searchTypedAddress(searchText);
        }

        setModalVisible(false);
    };
    // 📍 localização atual
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let loc = await Location.getCurrentPositionAsync({});

            setRegion(prev => ({
                ...prev,
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            }));

            let reverse = await Location.reverseGeocodeAsync(loc.coords);
            if (reverse.length > 0) {
                const addr = reverse[0];
                // Monta uma string amigável: "Rua Nome, 123 - Bairro"
                const fullAddress = formatReverseAddress(addr);

                // Se quiser incluir cidade também:
                // const fullAddress = `${addr.street}, ${addr.streetNumber} - ${addr.district}, ${addr.city}`;

                setLocationText(fullAddress || 'Localização desconhecida');
            }
        })();
    }, []);

    // 📍 atualizar endereço
    const updateAddress = async (coords: any) => {
        try {
            const reverse = await Location.reverseGeocodeAsync(coords);
            if (reverse.length > 0) {
                const addr = reverse[0];
                const fullAddress = formatReverseAddress(addr);
                setLocationText(fullAddress || 'Localização selecionada');
            }
        } catch {
            console.warn('Erro ao atualizar endereço');
        }
    };
    const fetchSuggestions = async (text = searchText) => {
        const searchText = text.trim();

        if (searchText.length < 3) {
            setSuggestions([]);
            return;
        }
        try {
            setLoading(true);
            const results = await searchAddressResults(searchText);
            setSuggestions(results);
        } catch (err) {
            console.warn("Erro autocomplete", err);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };
    const selectPlace = (item: Suggestion) => {
        moveMapToAddress(item.latitude, item.longitude, item.description);
    };

    const formatFatec = (fatec: Fatec) => {
        return `${fatec.nome} - ${fatec.cidade}/${fatec.uf}`;
    };

    const handleArrivalSearch = (text: string) => {
        setArrivalText(text);

        const query = normalizeText(text);

        if (query.length < 2) {
            setArrivalSuggestions([]);
            return;
        }

        const results = fatecs
            .filter((fatec) => {
                const searchableText = normalizeText([
                    fatec.nome,
                    fatec.cidade,
                    fatec.endereco,
                    fatec.cep || '',
                    fatec.uf,
                ].join(' '));

                return searchableText.includes(query);
            })
            .slice(0, 6);

        setArrivalSuggestions(results);
    };

    const selectArrival = (fatec: Fatec) => {
        setArrivalText(formatFatec(fatec));
        setArrivalSuggestions([]);
    };

    const openCalendar = () => {
        Keyboard.dismiss();
        dateInputRef.current?.blur();
        setManualDateInput(false);
        setCalendarMonth(new Date());
        setCalendarVisible(true);
    };

    const changeCalendarMonth = (amount: number) => {
        setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
    };

    const selectCalendarDate = (day: number) => {
        const selected = new Date(
            calendarMonth.getFullYear(),
            calendarMonth.getMonth(),
            day
        );

        if (isBeforeToday(selected)) return;

        setDepartureDate(formatDateBR(selected));
        setManualDateInput(false);
        Keyboard.dismiss();
        dateInputRef.current?.blur();
        setCalendarVisible(false);
    };

    const handleDepartureDateChange = (text: string) => {
        const formatted = formatTypedDate(text);
        const parsed = parseDateBR(formatted);

        if (formatted.length === 10 && parsed && isBeforeToday(parsed)) {
            setDepartureDate(formatDateBR(new Date()));
            return;
        }

        setDepartureDate(formatted);
    };

    const openTimePicker = () => {
        Keyboard.dismiss();
        timeInputRef.current?.blur();
        setManualTimeInput(false);
        setTimePickerVisible(true);
    };

    const isSelectedDateToday = () => {
        const parsed = parseDateBR(departureDate);

        return parsed ? isSameDay(parsed, new Date()) : false;
    };

    const isPastDepartureTime = (hour: number, minute: number) => {
        if (!isSelectedDateToday()) return false;

        const now = new Date();
        const selectedMinutes = hour * 60 + minute;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        return selectedMinutes < currentMinutes;
    };

    const handleDepartureTimeChange = (text: string) => {
        const digits = text.replace(/\D/g, '').slice(0, 4);
        const hour = digits.slice(0, 2);
        const minute = digits.slice(2, 4);
        const formatted = [hour, minute].filter(Boolean).join(':');

        if (formatted.length === 5) {
            const numericHour = Number(hour);
            const numericMinute = Number(minute);

            if (
                numericHour > 23 ||
                numericMinute > 59 ||
                isPastDepartureTime(numericHour, numericMinute)
            ) {
                const now = new Date();
                setDepartureTime(
                    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
                );
                return;
            }
        }

        setDepartureTime(formatted);
    };

    const selectTime = (hour: number, minute: number) => {
        if (isPastDepartureTime(hour, minute)) return;

        setDepartureTime(
            `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
        );
        setManualTimeInput(false);
        Keyboard.dismiss();
        timeInputRef.current?.blur();
        setTimePickerVisible(false);
    };

    const renderClassTimeSuggestions = () => (
        <View style={styles.classTimeSuggestions}>
            <Text style={styles.classTimeTitle}>Sugestoes de horario</Text>

            <View style={styles.classTimeRow}>
                {classTimeSuggestions.map((suggestion) => {
                    const isDisabled = isPastDepartureTime(suggestion.hour, suggestion.minute);

                    return (
                        <TouchableOpacity
                            key={suggestion.label}
                            style={[
                                styles.classTimeOption,
                                isDisabled && styles.classTimeDisabledOption,
                            ]}
                            disabled={isDisabled}
                            onPress={() => selectTime(suggestion.hour, suggestion.minute)}
                        >
                            <MaterialCommunityIcons
                                name="school-outline"
                                size={16}
                                color={isDisabled ? '#999' : '#E52929'}
                            />
                            <Text
                                style={[
                                    styles.classTimeOptionText,
                                    isDisabled && styles.classTimeDisabledText,
                                ]}
                            >
                                {suggestion.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Image
                    source={require('@/src/assets/images/Logoh.png')}
                    style={styles.LogoImage}
                />

                <TouchableOpacity style={styles.menuIcon}>
                    <MaterialCommunityIcons name="menu" size={24} color="#444D5A" />
                </TouchableOpacity>
            </View>

            {/* TÍTULO */}
            <Text style={styles.title}>Oferecer Viagem</Text>

            <ScrollView
                style={styles.forms}
                contentContainerStyle={styles.formsContent}
                showsVerticalScrollIndicator={false}
            >

                {/* LOCALIZAÇÃO */}
                <View style={styles.inputBox}>
                    <Text style={styles.label}>
                        Partida:
                    </Text>

                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => {
                            setSearchText('');
                            setSuggestions([]);
                            setModalVisible(true);
                        }}
                    >
                        {/* Ícone de Localização */}
                        <MaterialCommunityIcons
                            name="map-marker-radius"
                            size={22}
                            color="#E52929"
                            style={{ marginRight: 8 }}
                        />

                        {/* Texto com limite de linha para não quebrar o layout */}
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{ color: locationText ? '#000' : '#999', flex: 1 }}
                        >
                            {locationText || 'Selecionar partida'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* CHEGADA */}
                <View style={styles.inputBox}>
                    <Text style={styles.label}>
                        Chegada:
                    </Text>

                    <View style={styles.input}>
                        <MaterialCommunityIcons
                            name="school-outline"
                            size={22}
                            color="#E52929"
                            style={{ marginRight: 8 }}
                        />

                        <TextInput
                            style={styles.inlineInput}
                            placeholder="Pesquisar Fatec"
                            value={arrivalText}
                            onChangeText={handleArrivalSearch}
                            onFocus={() => {
                                if (arrivalText.length >= 2) {
                                    handleArrivalSearch(arrivalText);
                                }
                            }}
                            returnKeyType="search"
                        />

                        <Fontisto name="search" size={24} color="black" />
                    </View>

                    {arrivalSuggestions.length > 0 && (
                        <View style={styles.arrivalSuggestionBox}>
                            {arrivalSuggestions.map((fatec) => (
                                <TouchableOpacity
                                    key={`${fatec.nome}-${fatec.cidade}`}
                                    style={styles.arrivalSuggestionItem}
                                    onPress={() => selectArrival(fatec)}
                                >
                                    <Text style={styles.arrivalSuggestionTitle}>
                                        {fatec.nome}
                                    </Text>
                                    <Text style={styles.arrivalSuggestionText}>
                                        {fatec.cidade}/{fatec.uf} - {fatec.endereco}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* MODAL MAPA */}
                <Modal visible={modalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Selecionar Local</Text>
                                <TouchableOpacity onPress={confirmLocation}>
                                    <Text style={styles.close}>Confirmar</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 1 }}>

                                {/* LEGENDA DO RESULTADO ATUAL SOBRE O MAPA */}
                                <View style={styles.searchContainer}>
                                    <View style={styles.searchBox}>
                                        <MaterialCommunityIcons
                                            name="map-search-outline"
                                            size={20}
                                            color="#444"
                                            style={{ marginRight: 8 }}
                                        />

                                        <TextInput
                                            style={styles.searchInput}
                                            placeholder="Digite rua, cidade ou CEP"
                                            value={searchText}
                                            onFocus={handleSearchFocus}
                                            onPressIn={handleSearchFocus}
                                            onChangeText={handleSearchTextChange}
                                            onSubmitEditing={() => searchTypedAddress(searchText)}
                                            returnKeyType="search"
                                            selectTextOnFocus
                                        />

                                        {loading ? (
                                            <ActivityIndicator size="small" color="#E52929" />
                                        ) : (
                                            <TouchableOpacity onPress={() => searchTypedAddress(searchText)}>
                                                <Fontisto name="search" size={24} color="black" />
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {suggestions.length > 0 && (
                                        <View style={styles.suggestionBox}>
                                            {suggestions.map((item: Suggestion) => (
                                                <TouchableOpacity
                                                    key={item.id}
                                                    onPress={() => selectPlace(item)}
                                                    style={styles.suggestionItem}
                                                >
                                                    <Text>{item.description}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}

                                </View>
                                <MapNative
                                    region={region}
                                    setRegion={setRegion}
                                    updateAddress={updateAddress}
                                />
                            </View>

                        </View>
                    </View>

                </Modal>
                {/* DATA E HORA */}
                <View style={styles.inputBox}>
                    <Text style={styles.label}>Data e Hora de Saída:</Text>

                    <View style={styles.rowInputs}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.dateTimeInput}
                            onPress={() => {
                                if (!manualDateInput) {
                                    openCalendar();
                                }
                            }}
                        >
                            <TouchableOpacity onPress={openCalendar}>
                                <AntDesign name="calendar" size={24} color="#444" />
                            </TouchableOpacity>
                            <TextInput
                                ref={dateInputRef}
                                style={styles.dateTimeTextInput}
                                placeholder="DD/MM/AAAA"
                                value={departureDate}
                                onPressIn={() => {
                                    if (!manualDateInput) {
                                        openCalendar();
                                    }
                                }}
                                onChangeText={handleDepartureDateChange}
                                keyboardType="numeric"
                                editable={manualDateInput}
                                showSoftInputOnFocus={manualDateInput}
                                maxLength={10}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.dateTimeInput}
                            onPress={() => {
                                if (!manualTimeInput) {
                                    openTimePicker();
                                }
                            }}
                        >
                            <TouchableOpacity onPress={openTimePicker}>
                                <MaterialCommunityIcons name="clock-outline" size={24} color="#444" />
                            </TouchableOpacity>
                            <TextInput
                                ref={timeInputRef}
                                style={styles.dateTimeTextInput}
                                placeholder="HH:MM"
                                value={departureTime}
                                onPressIn={() => {
                                    if (!manualTimeInput) {
                                        openTimePicker();
                                    }
                                }}
                                onChangeText={handleDepartureTimeChange}
                                keyboardType="numeric"
                                editable={manualTimeInput}
                                showSoftInputOnFocus={manualTimeInput}
                                maxLength={5}
                            />
                        </TouchableOpacity>
                    </View>

                </View>

                <Modal
                    visible={calendarVisible}
                    animationType="fade"
                    transparent
                    onRequestClose={() => setCalendarVisible(false)}
                >
                    <View style={styles.calendarOverlay}>
                        <View style={styles.calendarContent}>
                            <View style={styles.calendarHeader}>
                                <TouchableOpacity
                                    style={styles.calendarNavButton}
                                    onPress={() => changeCalendarMonth(-1)}
                                >
                                    <AntDesign name="left" size={18} color="#444" />
                                </TouchableOpacity>

                                <Text style={styles.calendarTitle}>
                                    {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                                </Text>

                                <TouchableOpacity
                                    style={styles.calendarNavButton}
                                    onPress={() => changeCalendarMonth(1)}
                                >
                                    <AntDesign name="right" size={18} color="#444" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.weekDaysRow}>
                                {weekDays.map((day, index) => (
                                    <Text key={`${day}-${index}`} style={styles.weekDayText}>
                                        {day}
                                    </Text>
                                ))}
                            </View>

                            <View style={styles.calendarGrid}>
                                {getCalendarDays(calendarMonth).map((day, index) => {
                                    const today = new Date();
                                    const dayDate = day
                                        ? new Date(
                                            calendarMonth.getFullYear(),
                                            calendarMonth.getMonth(),
                                            day
                                        )
                                        : null;
                                    const isToday =
                                        day === today.getDate() &&
                                        calendarMonth.getMonth() === today.getMonth() &&
                                        calendarMonth.getFullYear() === today.getFullYear();
                                    const isDisabled = !dayDate || isBeforeToday(dayDate);

                                    return (
                                        <TouchableOpacity
                                            key={`${day || 'empty'}-${index}`}
                                            style={[
                                                styles.calendarDay,
                                                isToday && styles.calendarToday,
                                                isDisabled && styles.calendarDisabledDay,
                                            ]}
                                            disabled={isDisabled}
                                            onPress={() => day && selectCalendarDate(day)}
                                        >
                                            <Text
                                                style={[
                                                    styles.calendarDayText,
                                                    isToday && styles.calendarTodayText,
                                                    isDisabled && styles.calendarDisabledText,
                                                ]}
                                            >
                                                {day || ''}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <View style={styles.calendarActions}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setManualDateInput(true);
                                        Keyboard.dismiss();
                                        setCalendarVisible(false);
                                        setTimeout(() => {
                                            dateInputRef.current?.focus();
                                        }, 250);
                                    }}
                                >
                                    <Text style={styles.calendarActionText}>Digitar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setDepartureDate(formatDateBR(new Date()));
                                        setManualDateInput(false);
                                        Keyboard.dismiss();
                                        dateInputRef.current?.blur();
                                        setCalendarVisible(false);
                                    }}
                                >
                                    <Text style={styles.calendarActionText}>Hoje</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={timePickerVisible}
                    animationType="fade"
                    transparent
                    onRequestClose={() => setTimePickerVisible(false)}
                >
                    <View style={styles.calendarOverlay}>
                        <View style={styles.timePickerContent}>
                            <Text style={styles.calendarTitle}>Selecionar Horario</Text>

                            {renderClassTimeSuggestions()}

                            <View style={styles.timePickerGrid}>
                                {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((hour) => {
                                    const isDisabled = isPastDepartureTime(hour, 0);

                                    return (
                                        <TouchableOpacity
                                            key={hour}
                                            style={[
                                                styles.timeOption,
                                                isDisabled && styles.timeDisabledOption,
                                            ]}
                                            disabled={isDisabled}
                                            onPress={() => selectTime(hour, 0)}
                                        >
                                            <Text
                                                style={[
                                                    styles.timeOptionText,
                                                    isDisabled && styles.timeDisabledText,
                                                ]}
                                            >
                                                {String(hour).padStart(2, '0')}:00
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <View style={styles.minuteRow}>
                                {[0, 15, 30, 45].map((minute) => {
                                    const currentHour = departureTime
                                        ? Number(departureTime.split(':')[0])
                                        : new Date().getHours();
                                    const safeHour = Number.isFinite(currentHour) ? currentHour : 8;
                                    const isDisabled = isPastDepartureTime(safeHour, minute);

                                    return (
                                        <TouchableOpacity
                                            key={minute}
                                            style={[
                                                styles.minuteOption,
                                                isDisabled && styles.timeDisabledOption,
                                            ]}
                                            disabled={isDisabled}
                                            onPress={() => selectTime(safeHour, minute)}
                                        >
                                            <Text
                                                style={[
                                                    styles.timeOptionText,
                                                    isDisabled && styles.timeDisabledText,
                                                ]}
                                            >
                                                :{String(minute).padStart(2, '0')}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <View style={styles.calendarActions}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setManualTimeInput(true);
                                        Keyboard.dismiss();
                                        setTimePickerVisible(false);
                                        setTimeout(() => {
                                            timeInputRef.current?.focus();
                                        }, 250);
                                    }}
                                >
                                    <Text style={styles.calendarActionText}>Digitar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setManualTimeInput(false);
                                        Keyboard.dismiss();
                                        timeInputRef.current?.blur();
                                        setTimePickerVisible(false);
                                    }}
                                >
                                    <Text style={styles.calendarActionText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* VAGAS */}
                <View style={styles.inputBox}>
                    <Text style={styles.label}>Lugares:</Text>

                    <View style={styles.seatsRow}>

                        <View style={styles.seatsIconsRow}>
                            {Array.from({ length: MAX_SEATS }).map((_, index) => (
                                <MaterialCommunityIcons
                                    key={index}
                                    name="seatbelt"
                                    size={24}
                                    color={index < seats ? '#E52929' : '#CFCFCF'}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.seatBtn, seats === 1 && { opacity: 0.4 }]}
                            disabled={seats === 1}
                            onPress={() => setSeats(seats - 1)}
                        >
                            <Text style={styles.seatBtnText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.seatCount}>{seats}</Text>

                        <TouchableOpacity
                            style={[styles.seatBtn, seats === MAX_SEATS && { opacity: 0.4 }]}
                            disabled={seats === MAX_SEATS}
                            onPress={() => setSeats(seats + 1)}
                        >
                            <Text style={styles.seatBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.confirmBtn}>
                    <Text style={styles.confirmBtnText}>Confirmar</Text>
                </TouchableOpacity>

                {/* BOTÃO */}

            </ScrollView>


            {/* NAV */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <AntDesign name="home" size={24} color="#444D5A" />
                </TouchableOpacity>

                <View style={styles.navDivider} />

                <TouchableOpacity style={styles.navItem}>
                    <MaterialCommunityIcons name="file-document-outline" size={24} color="#E52929" />
                </TouchableOpacity>

                <View style={styles.navDivider} />

                <TouchableOpacity style={styles.navItem}>
                    <FontAwesome5 name="user" size={24} color="#444D5A" />
                </TouchableOpacity>
            </View>
        </View >
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', paddingTop: 50 },

    LogoImage: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 24,
    },

    menuIcon: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8E8E8',
        borderRadius: 8,
    },

    title: {
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
    },

    forms: {
        flex: 1,
    },

    formsContent: {
        alignItems: 'center',
        paddingBottom: 18,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end', // Empurra o modal para a parte de baixo da tela
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cria aquele efeito de fundo escurecido
    },

    modalContent: {
        height: '80%', // Aqui você define que ele ocupa 80% da tela
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24, // Arredonda as pontas de cima para ficar com cara de Bottom Sheet
        borderTopRightRadius: 24,
        overflow: 'hidden', // Evita que o mapa vaze pelas bordas arredondadas
        paddingBottom: 20, // Espaço extra embaixo, útil para iOS (Home Indicator)
    },
    searchContainer: {
        margin: 16,
        zIndex: 20,
        elevation: 20,
    },

    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 12,
    },

    searchInput: {
        flex: 1,
        height: 44,
        fontSize: 14,
    },
    inlineInput: {
        flex: 1,
        minHeight: 24,
        fontSize: 14,
        color: '#222',
        outlineStyle: 'none' as any,
    },
    inputBox: {
        width: '85%',
        marginBottom: 18,
    },
    input: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderColor: '#DDD',
        flexDirection: 'row', // Alinha o ícone e o texto lado a lado
        alignItems: 'center', // Centraliza verticalmente
    },

    // --- NOVOS ESTILOS PARA A LEGENDA DO MAPA ---
    mapLegend: {
        position: 'absolute',
        top: 16,
        left: '5%',
        width: '90%',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10, // Garante que fique por cima do MapNative
        elevation: 5, // Sombra no Android
        shadowColor: '#000', // Sombra no iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    mapLegendText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },

    label: {
        fontSize: 14,
        color: '#222',
        fontWeight: '700',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },

    modalHeader: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    modalTitle: { fontSize: 18, fontWeight: 'bold' },

    close: { color: '#E52929', fontWeight: 'bold' },

    rowInputs: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },

    dateTimeInput: {
        flex: 1,
        minHeight: 48,
        backgroundColor: '#E8E8E8',
        borderRadius: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    dateTimeTextInput: {
        flex: 1,
        fontSize: 14,
        color: '#222',
        outlineStyle: 'none' as any,
    },

    calendarOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    calendarContent: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
    },

    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },

    calendarNavButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#F1F1F1',
    },

    calendarTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },

    weekDaysRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },

    weekDayText: {
        width: `${100 / 7}%`,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '700',
        color: '#666',
    },

    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    calendarDay: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },

    calendarToday: {
        backgroundColor: '#E52929',
    },

    calendarDisabledDay: {
        opacity: 0.35,
    },

    calendarDayText: {
        fontSize: 14,
        color: '#222',
    },

    calendarTodayText: {
        color: '#FFF',
        fontWeight: '700',
    },

    calendarDisabledText: {
        color: '#999',
    },

    calendarActions: {
        marginTop: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    calendarActionText: {
        color: '#E52929',
        fontWeight: '700',
        fontSize: 14,
    },

    timePickerContent: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
    },

    timePickerGrid: {
        marginTop: 14,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    timeOption: {
        width: '22%',
        minHeight: 40,
        borderRadius: 8,
        backgroundColor: '#F1F1F1',
        alignItems: 'center',
        justifyContent: 'center',
    },

    timeOptionText: {
        fontSize: 14,
        color: '#222',
        fontWeight: '600',
    },

    minuteRow: {
        marginTop: 14,
        flexDirection: 'row',
        gap: 8,
    },

    minuteOption: {
        flex: 1,
        minHeight: 40,
        borderRadius: 8,
        backgroundColor: '#F7F7F7',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
    },

    timeDisabledOption: {
        opacity: 0.35,
    },

    timeDisabledText: {
        color: '#999',
    },

    classTimeSuggestions: {
        width: '85%',
        marginBottom: 18,
    },

    classTimeTitle: {
        fontSize: 13,
        color: '#444',
        fontWeight: '700',
        marginBottom: 8,
    },

    classTimeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    classTimeOption: {
        minHeight: 38,
        borderRadius: 8,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E52929',
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    classTimeOptionText: {
        fontSize: 13,
        color: '#E52929',
        fontWeight: '700',
    },

    classTimeDisabledOption: {
        borderColor: '#DDD',
        backgroundColor: '#F1F1F1',
        opacity: 0.55,
    },

    classTimeDisabledText: {
        color: '#999',
    },

    iconInput: {
        backgroundColor: '#E8E8E8',
        borderRadius: 10,
        padding: 12,
    },

    seatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 12,
    },

    seatsIconsRow: { flexDirection: 'row', gap: 4 },

    seatBtn: {
        backgroundColor: '#E8E8E8',
        borderRadius: 8,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },

    seatBtnText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    seatCount: {
        fontSize: 18,
        fontWeight: 'bold',
        minWidth: 24,
        textAlign: 'center',
    },
    suggestionBox: {
        position: 'absolute',
        top: 52,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderRadius: 8,
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#DDD',
        zIndex: 30,
        elevation: 30,
    },

    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    arrivalSuggestionBox: {
        marginTop: 6,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD',
        overflow: 'hidden',
    },

    arrivalSuggestionItem: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },

    arrivalSuggestionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#222',
    },

    arrivalSuggestionText: {
        marginTop: 2,
        fontSize: 12,
        color: '#666',
    },
    inputBoxRow: {
        width: '85%',
        backgroundColor: '#E8E8E8',
        borderRadius: 10,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 18,
    },

    inputLabelRow: {
        fontSize: 14,
        fontWeight: '500',
    },

    confirmBtn: {
        width: '70%',
        backgroundColor: '#E52929',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },

    confirmBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#EBEBEB',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        height: 60,
        alignItems: 'center',
    },

    navItem: {
        flex: 1,
        alignItems: 'center',
    },

    navDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#CCC',
    },
});
