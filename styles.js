import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#B23A48',    // Rojo cálido: Celebración, encabezado
  highPriority: '#D4AF37', // Dorado: Prioridad alta
  available: '#588157',   // Verde: Disponible
  reserved: '#9E9E9E',    // Gris: Reservado / Discreción
  bg: '#FAFAFA',
  white: '#FFFFFF',
  text: '#333333'
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  toggleModeBtn: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 6,
    borderRadius: 5,
    marginTop: 8,
  },
  toggleModeText: {
    color: COLORS.white,
    fontSize: 12,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  price: {
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  btnReserve: {
    backgroundColor: COLORS.available,
    paddingPadding: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  btnCancel: {
    backgroundColor: COLORS.reserved,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  }
});