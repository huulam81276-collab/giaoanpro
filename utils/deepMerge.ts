
// A simple deep merge function to combine new lesson plan parts with the existing state.
export const deepMerge = (target: any, source: any): any => {
  if (typeof target !== 'object' || target === null || Array.isArray(target) ||
      typeof source !== 'object' || source === null || Array.isArray(source)) {
    return source;
  }

  const output = { ...target };

  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!(key in target)) {
        Object.assign(output, { [key]: source[key] });
      } else {
        output[key] = deepMerge(target[key], source[key]);
      }
    } else {
      Object.assign(output, { [key]: source[key] });
    }
  });

  return output;
};
