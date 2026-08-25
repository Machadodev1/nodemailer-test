export function redirectToError(res, status, error) {
  const message = encodeURIComponent(error?.message || error || 'Ha ocurrido un error');
  return res.redirect(`/error?status=${status || 500}&error=${message}`);
}

export function renderError(res, status, error) {
  return res.status(status || 500).render('error', {
    status: status || 500,
    error: error?.message || error || 'Ha ocurrido un error',
  });
}
