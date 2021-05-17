import re
import numpy as np
import json
import sys


def tokenize(query):
    """
    tokenize a query into words
    """
    query = query.lower()
    query = re.sub(r'[^\w\s]', '', query) # remove punctuations
    return query.split(' ')


def term_frequency(q, document):
    """
    assume document is tokenized
    """
    tf = 0
    for w in document:
        if w == q:
            tf += 1
    return tf


def compare(l1, l2):
    diff = 0
    for i in range(len(l1)):
        for j in range(i + 1, len(l1)):
            if (l1[i] - l1[j]) * (l2[i] - l2[j]) < 0:
                diff += 1
    return 1 - diff / (len(l1) * (len(l1) + 1) / 2)


class BM25:
    def __init__(self, documents, k1, b):
        self.avgdl = 0
        docs = []
        for doc in documents:
            d = tokenize(doc)
            docs.append(d)
            self.avgdl += len(d)
        self.documents = docs
        self.avgdl /= len(docs)
        self.k1 = k1
        self.b = b

    def get_score(self, document, query, idf):
        """compute score(D, Q)
        reference: https://en.wikipedia.org/wiki/Okapi_BM25
        """
        score = 0
        for q in query:
            f = term_frequency(q, document)
            cur = idf[q] * (f * (self.k1 + 1)) / (f + self.k1 * (1 - self.b + self.b * len(document) / self.avgdl))
            score += cur
        return score

    def get_scores(self, query):
        """get scores for self.documents given query
        Args:
            query (string): un-preprcessed query string
        """
        query = tokenize(query)
        # prepare idf
        idf_dict = {}
        N = len(self.documents)
        for q in query:
            n_q = 0
            for doc in self.documents:
                if q in doc:
                    n_q += 1
            idf = np.log((N - n_q + 0.5) / (n_q + 0.5) + 1)
            idf_dict[q] = idf
        # print(f"scores for query '{query}':")
        scores = []
        for i in range(len(self.documents)):
            scores.append(self.get_score(self.documents[i], query, idf_dict))
        return scores

    def __str__(self):
        return f"BM25(k1={self.k1})"


if __name__ == "__main__":
    l1, l2 = [], []
    with open('components/data.json') as f:
        data = json.load(f)
    for i in data:
        l1.append(i['title'])
        t = ''
        for j in i['answers']:
            t += j
        l2.append(t)

    q = ' '.join(sys.argv[1:])
    r1 = BM25(l1, k1=1.2, b=0.75).get_scores(q)
    r2 = BM25(l2, k1=1.2, b=0.75).get_scores(q)
    r = [[0.7 * r1[i] + 0.3 * r2[i], i] for i in range(len(r1))]
    r.sort(reverse=True)

    result = []
    for i in r:
        result.append(data[i[1]])
    for i in range(len(result)):
        result[i]['id'] = i
        print(result[i]['title'])
    with open('components/data.json', 'w') as outfile:
        json.dump(result, outfile, indent=4)
