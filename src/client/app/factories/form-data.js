export const create = () => {
  const formData = new FormData();

  return {
    append,
    data
  };

  function append(...args) {
    return formData.append(...args);
  }

  function data() {
    return formData;
  }
};
