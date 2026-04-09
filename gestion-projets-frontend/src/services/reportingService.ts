import api from '../utils/axiosConfig';

export const reportingService = {
  getDashboard: () => api.get('/reporting/tableau-de-bord'),
  getPhasesTermineesNonFacturees: () => api.get('/reporting/phases/terminees-non-facturees'),
  getPhasesFactureesNonPayees: () => api.get('/reporting/phases/facturees-non-payees'),
  getPhasesPayees: () => api.get('/reporting/phases/payees'),
  getProjetsEnCours: () => api.get('/reporting/projets/en-cours'),
  getProjetsClotures: () => api.get('/reporting/projets/clotures'),
};
