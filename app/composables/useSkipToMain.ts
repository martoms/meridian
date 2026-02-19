export const useSkipToMain = () => {
  const skipToMain = () => {
    document.getElementById('main-content')?.focus()
  }

  return { skipToMain }
}
