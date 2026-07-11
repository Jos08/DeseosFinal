import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Animated } from 'react-native';
import { styles, COLORS } from './styles';

const API_URL = 'http://192.168.1.77:3000/deseos';

// Creamos el componente animado para las tarjetas de la App principal
const AnimatedCard = ({ item, esDueno, reservarArticulo, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.93)).current;

  useEffect(() => {
    // Animación resorte escalonada súper fluida
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, delay: index * 60, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, delay: index * 60, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, delay: index * 60, useNativeDriver: true })
    ]).start();
  }, [item.id]);

  const borderColor = item.prioridad === 'alta' ? COLORS.highPriority : COLORS.primary;
  const badgeColor = item.reservado ? COLORS.reserved : COLORS.available;

  return (
    <Animated.View style={[
      styles.card, 
      { 
        borderLeftColor: borderColor, 
        opacity: fadeAnim, 
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }] 
      }
    ]}>
      <Text style={styles.cardTitle}>{item.articulo}</Text>
      <Text style={styles.cardSubtitle}>🎉 Ocasión: {item.ocasion}</Text>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>💰 Est: ${item.precio_estimado}</Text>
      </View>
      
      <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.statusText}>
          {item.reservado ? '🔒 Reservado' : '✨ Disponible'}
        </Text>
      </View>

      {!esDueno && item.reservado && item.reservado_por ? (
        <Text style={[styles.cardSubtitle, { fontStyle: 'italic', marginTop: 8, color: COLORS.textLight }]}>
          Reservado por: {item.reservado_por}
        </Text>
      ) : null}

      {!esDueno && (
        <View style={styles.actions}>
          <TouchableOpacity 
            activeOpacity={0.6}
            style={item.reservado ? styles.btnCancel : styles.btnReserve}
            onPress={() => reservarArticulo(item.id, item.reservado)}
          >
            <Text style={styles.btnText}>
              {item.reservado ? '🚫 Cancelar Reserva' : '🤝 Reservar Regalo'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

export default function App() {
  const [deseos, setDeseos] = useState([]);
  const [esDueno, setEsDueno] = useState(false);

  const fetchDeseos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setDeseos(data);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  useEffect(() => {
    fetchDeseos();
  }, []);

  const reservarArticulo = async (id, yaReservado) => {
    const nombreReserva = yaReservado ? "" : "Amigo Secreto";
    try {
      const response = await fetch(`${API_URL}/${id}/reservar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservado: yaReservado ? 0 : 1,
          reservado_por: yaReservado ? null : nombreReserva
        })
      });
      if (response.ok) {
        fetchDeseos();
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la reserva");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎁 Lista de Deseos</Text>
        <TouchableOpacity 
          activeOpacity={0.85}
          style={styles.toggleModeBtn} 
          onPress={() => setEsDueno(!esDueno)}
        >
          <Text style={styles.toggleModeText}>
            Modo: {esDueno ? '👑 Dueño' : '👥 Invitado'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={deseos}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <AnimatedCard 
            item={item} 
            index={index} 
            esDueno={esDueno} 
            reservarArticulo={reservarArticulo} 
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}