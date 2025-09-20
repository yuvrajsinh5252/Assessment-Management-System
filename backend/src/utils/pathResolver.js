function normalizeValue(value, fieldConfig = {}) {
  if (value === undefined || value === null || value === '') {
    return fieldConfig.defaultValue ?? 'N/A';
  }

  if (fieldConfig.type === 'list' && Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'number') {
    if (typeof fieldConfig.decimals === 'number') {
      return Number(value.toFixed(fieldConfig.decimals));
    }
    return value;
  }

  if (!Number.isNaN(Number(value)) && value !== '') {
    const numericValue = Number(value);
    if (typeof fieldConfig.decimals === 'number') {
      return Number(numericValue.toFixed(fieldConfig.decimals));
    }
    return numericValue;
  }

  return value;
}

function resolveSegment(target, segment) {
  if (target === undefined || target === null) {
    return undefined;
  }

  const regex = /([^\[]+)|(\[[^\]]+\])/g;
  const parts = segment.match(regex);
  if (!parts || parts.length === 0) {
    return target[segment];
  }

  let current = target;
  parts.forEach((part) => {
    if (part.startsWith('[')) {
      const expression = part.slice(1, -1);
      if (Array.isArray(current)) {
        if (/^\d+$/.test(expression)) {
          current = current[Number(expression)];
        } else if (expression.includes('=')) {
          const [prop, rawValue] = expression.split('=');
          const cleanedValue = rawValue.replace(/^['\"]|['\"]$/g, '');
          current = current.find((item) => {
            if (item && Object.prototype.hasOwnProperty.call(item, prop)) {
              return String(item[prop]) === cleanedValue;
            }
            if (item && typeof item === 'object') {
              return String(resolvePath(item, prop)) === cleanedValue;
            }
            return false;
          });
        }
      } else {
        current = undefined;
      }
    } else {
      if (current && Object.prototype.hasOwnProperty.call(current, part)) {
        current = current[part];
      } else {
        current = undefined;
      }
    }
  });

  return current;
}

function resolvePath(data, path, fieldConfig = {}) {
  if (!path) {
    return undefined;
  }

  const segments = path.split('.');
  let current = data;
  for (const segment of segments) {
    if (segment === '$root') {
      current = data;
      continue;
    }
    current = resolveSegment(current, segment);
    if (current === undefined || current === null) {
      break;
    }
  }

  return normalizeValue(current, fieldConfig);
}

module.exports = {
  resolvePath,
};
