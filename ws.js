function escape(v) {
  return v.toString().replace(/@/g, '@A').replace(/\//g, '@S');
}

function unescape(v) {
  return v.toString().replace(/@S/g, '/').replace(/@A/g, '@');
}

function serialize(raw) {
  if (Object.prototype.toString.call(raw).slice(8, -1) === 'Object') {
      return Object.entries(raw)
          .map(([k, v]) => `${k}@=${serialize(v)}`)
          .join('');
  } else if (Array.isArray(raw)) {
      return raw.map(v => `${serialize(v)}`).join('');
  } else {
      return escape(raw.toString()) + '/';
  }
}

function deserialize(raw) {
  if (raw.includes('//')) {
      return raw.split('//')
          .filter(e => e !== '')
          .map(item => deserialize(item));
  }

  if (raw.includes('@=')) {
      return raw.split('/')
          .filter(e => e !== '')
          .reduce((o, s) => {
              const [k, v] = s.split('@=');
              return o[k] = v ? deserialize(v) : '', o;
          }, {});
  } else {
      return unescape(raw);
  }
}